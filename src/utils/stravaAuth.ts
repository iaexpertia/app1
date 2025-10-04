import { Cyclist } from '../types';
import { updateCyclist } from './cyclistStorage';

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const REDIRECT_URI = `${window.location.origin}/strava-callback`;

export const initiateStravaAuth = () => {
  const scope = 'activity:read_all,profile:read_optional';
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&approval_prompt=force&scope=${scope}`;

  // Open in popup window
  const width = 600;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  window.open(
    authUrl,
    'Strava Authorization',
    `width=${width},height=${height},left=${left},top=${top}`
  );
};

export const exchangeStravaCode = async (code: string, cyclist: Cyclist): Promise<boolean> => {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange Strava authorization code');
    }

    const data = await response.json();

    // Update cyclist with Strava tokens
    const updatedCyclist: Cyclist = {
      ...cyclist,
      stravaConnected: true,
      stravaAthleteId: data.athlete.id.toString(),
      stravaAccessToken: data.access_token,
      stravaRefreshToken: data.refresh_token,
      stravaTokenExpiry: data.expires_at,
    };

    updateCyclist(updatedCyclist);
    return true;
  } catch (error) {
    console.error('Error exchanging Strava code:', error);
    return false;
  }
};

export const refreshStravaToken = async (cyclist: Cyclist): Promise<string | null> => {
  if (!cyclist.stravaRefreshToken) {
    return null;
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: cyclist.stravaRefreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Strava token');
    }

    const data = await response.json();

    // Update cyclist with new tokens
    const updatedCyclist: Cyclist = {
      ...cyclist,
      stravaAccessToken: data.access_token,
      stravaRefreshToken: data.refresh_token,
      stravaTokenExpiry: data.expires_at,
    };

    updateCyclist(updatedCyclist);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    return null;
  }
};

export const getValidStravaToken = async (cyclist: Cyclist): Promise<string | null> => {
  if (!cyclist.stravaAccessToken || !cyclist.stravaTokenExpiry) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Math.floor(Date.now() / 1000);
  if (now >= cyclist.stravaTokenExpiry - 300) {
    // Token expired or about to expire, refresh it
    return await refreshStravaToken(cyclist);
  }

  return cyclist.stravaAccessToken;
};

export const disconnectStrava = (cyclist: Cyclist): void => {
  const updatedCyclist: Cyclist = {
    ...cyclist,
    stravaConnected: false,
    stravaAthleteId: undefined,
    stravaAccessToken: undefined,
    stravaRefreshToken: undefined,
    stravaTokenExpiry: undefined,
  };

  updateCyclist(updatedCyclist);
};
