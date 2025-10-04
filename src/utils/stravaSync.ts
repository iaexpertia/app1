import { Cyclist, StravaActivity, MountainPass, ConquestData } from '../types';
import { getValidStravaToken } from './stravaAuth';
import { loadConquests, saveConquests } from './storage';

const MATCH_DISTANCE_KM = 5; // Match activities within 5km of pass coordinates

export const fetchStravaActivities = async (
  cyclist: Cyclist,
  after?: number,
  page: number = 1,
  perPage: number = 100
): Promise<StravaActivity[]> => {
  const accessToken = await getValidStravaToken(cyclist);

  if (!accessToken) {
    throw new Error('No valid Strava access token available');
  }

  try {
    let url = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`;

    if (after) {
      url += `&after=${after}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Strava activities');
    }

    const activities: StravaActivity[] = await response.json();
    return activities;
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    throw error;
  }
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const matchActivityToPass = (
  activity: StravaActivity,
  pass: MountainPass
): boolean => {
  // Check if activity has location data
  if (!activity.start_latlng && !activity.end_latlng) {
    return false;
  }

  // Check start location
  if (activity.start_latlng) {
    const distance = calculateDistance(
      activity.start_latlng[0],
      activity.start_latlng[1],
      pass.coordinates.lat,
      pass.coordinates.lng
    );
    if (distance <= MATCH_DISTANCE_KM) {
      return true;
    }
  }

  // Check end location
  if (activity.end_latlng) {
    const distance = calculateDistance(
      activity.end_latlng[0],
      activity.end_latlng[1],
      pass.coordinates.lat,
      pass.coordinates.lng
    );
    if (distance <= MATCH_DISTANCE_KM) {
      return true;
    }
  }

  return false;
};

export const syncStravaActivities = async (
  cyclist: Cyclist,
  passes: MountainPass[]
): Promise<{ synced: number; newConquests: ConquestData[] }> => {
  try {
    // Get existing conquests
    const existingConquests = loadConquests(cyclist.id);
    const existingStravaIds = new Set(
      existingConquests
        .filter(c => c.stravaActivityId)
        .map(c => c.stravaActivityId)
    );

    // Fetch activities from the last year
    const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
    const activities = await fetchStravaActivities(cyclist, oneYearAgo);

    const newConquests: ConquestData[] = [];
    let syncedCount = 0;

    // Match activities to passes
    for (const activity of activities) {
      // Skip if already synced
      if (existingStravaIds.has(activity.id.toString())) {
        continue;
      }

      // Only consider ride activities
      if (activity.type !== 'Ride' && activity.type !== 'VirtualRide') {
        continue;
      }

      // Try to match with passes
      for (const pass of passes) {
        if (matchActivityToPass(activity, pass)) {
          // Check if this pass is already conquered (not from Strava)
          const alreadyConquered = existingConquests.some(
            c => c.passId === pass.id && !c.stravaActivityId
          );

          if (!alreadyConquered) {
            const conquest: ConquestData = {
              passId: pass.id,
              dateCompleted: activity.start_date.split('T')[0],
              timeCompleted: new Date(activity.start_date).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              stravaActivityId: activity.id.toString(),
              stravaActivityUrl: `https://www.strava.com/activities/${activity.id}`,
              syncedFromStrava: true,
              personalNotes: `Sincronizado desde Strava: ${activity.name}`,
            };

            newConquests.push(conquest);
            syncedCount++;
          }

          // Don't match the same activity to multiple passes
          break;
        }
      }
    }

    // Save new conquests
    if (newConquests.length > 0) {
      const allConquests = [...existingConquests, ...newConquests];
      saveConquests(cyclist.id, allConquests);
    }

    return { synced: syncedCount, newConquests };
  } catch (error) {
    console.error('Error syncing Strava activities:', error);
    throw error;
  }
};

export const getSyncStatus = (cyclist: Cyclist): {
  connected: boolean;
  athleteId?: string;
  lastSync?: Date;
} => {
  return {
    connected: cyclist.stravaConnected || false,
    athleteId: cyclist.stravaAthleteId,
  };
};
