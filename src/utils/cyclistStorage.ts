import { Cyclist } from '../types';
import { supabase } from '../lib/supabase';

const CYCLISTS_STORAGE_KEY = 'mountain-pass-cyclists';
const CURRENT_USER_KEY = 'currentUserId';

export const saveCyclists = (cyclists: Cyclist[]): void => {
  localStorage.setItem(CYCLISTS_STORAGE_KEY, JSON.stringify(cyclists));
};

export const loadCyclists = (): Cyclist[] => {
  const stored = localStorage.getItem(CYCLISTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getCurrentUser = (): Cyclist | null => {
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) return null;

  const cyclists = loadCyclists();
  return cyclists.find(c => c.id === currentUserId) || null;
};

export const authenticateUser = async (email: string, password: string): Promise<Cyclist | null> => {
  try {
    const { data, error } = await supabase
      .from('cyclists')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const cyclist: Cyclist = {
      id: data.id,
      name: data.name,
      alias: data.alias,
      email: data.email,
      password: data.password,
      phone: data.phone,
      city: data.city,
      country: data.country,
      age: data.age,
      weight: data.weight,
      profilePhoto: data.profile_photo,
      bikes: data.bikes || [],
      registrationDate: data.registration_date,
      isAdmin: data.is_admin,
      stravaConnected: data.strava_connected,
      stravaAthleteId: data.strava_athlete_id,
      stravaAccessToken: data.strava_access_token,
      stravaRefreshToken: data.strava_refresh_token,
      stravaTokenExpiry: data.strava_token_expiry
    };

    return cyclist;
  } catch (err) {
    console.error('Error authenticating user:', err);
    return null;
  }
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  const cyclist = await authenticateUser(email, password);
  if (cyclist) {
    setCurrentUser(cyclist.id);
    const cyclists = loadCyclists();
    const existingIndex = cyclists.findIndex(c => c.id === cyclist.id);

    if (existingIndex >= 0) {
      cyclists[existingIndex] = cyclist;
    } else {
      cyclists.push(cyclist);
    }

    saveCyclists(cyclists);
    return true;
  }
  return false;
};

export const setCurrentUser = (cyclistId: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, cyclistId);
};

export const isCurrentUserAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }
  return currentUser?.isAdmin || false;
};

export const addCyclist = async (cyclist: Cyclist): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cyclists')
      .insert({
        id: cyclist.id,
        name: cyclist.name,
        alias: cyclist.alias,
        email: cyclist.email.toLowerCase(),
        password: cyclist.password,
        phone: cyclist.phone,
        city: cyclist.city,
        country: cyclist.country,
        age: cyclist.age,
        weight: cyclist.weight,
        profile_photo: cyclist.profilePhoto,
        bikes: cyclist.bikes || [],
        registration_date: cyclist.registrationDate,
        is_admin: cyclist.isAdmin || false,
        strava_connected: cyclist.stravaConnected || false,
        strava_athlete_id: cyclist.stravaAthleteId,
        strava_access_token: cyclist.stravaAccessToken,
        strava_refresh_token: cyclist.stravaRefreshToken,
        strava_token_expiry: cyclist.stravaTokenExpiry
      });

    if (error) {
      throw error;
    }

    const cyclists = loadCyclists();
    const existingIndex = cyclists.findIndex(c => c.id === cyclist.id);

    if (existingIndex >= 0) {
      cyclists[existingIndex] = cyclist;
    } else {
      cyclists.push(cyclist);
    }

    saveCyclists(cyclists);
  } catch (err) {
    console.error('Error adding cyclist:', err);
    throw err;
  }
};

export const removeCyclist = async (cyclistId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cyclists')
      .delete()
      .eq('id', cyclistId);

    if (error) {
      throw error;
    }

    const cyclists = loadCyclists();
    const filteredCyclists = cyclists.filter(c => c.id !== cyclistId);
    saveCyclists(filteredCyclists);
  } catch (err) {
    console.error('Error removing cyclist:', err);
    throw err;
  }
};

export const updateCyclist = async (cyclist: Cyclist): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cyclists')
      .update({
        name: cyclist.name,
        alias: cyclist.alias,
        email: cyclist.email.toLowerCase(),
        password: cyclist.password,
        phone: cyclist.phone,
        city: cyclist.city,
        country: cyclist.country,
        age: cyclist.age,
        weight: cyclist.weight,
        profile_photo: cyclist.profilePhoto,
        bikes: cyclist.bikes || [],
        is_admin: cyclist.isAdmin || false,
        strava_connected: cyclist.stravaConnected || false,
        strava_athlete_id: cyclist.stravaAthleteId,
        strava_access_token: cyclist.stravaAccessToken,
        strava_refresh_token: cyclist.stravaRefreshToken,
        strava_token_expiry: cyclist.stravaTokenExpiry,
        updated_at: new Date().toISOString()
      })
      .eq('id', cyclist.id);

    if (error) {
      throw error;
    }

    const cyclists = loadCyclists();
    const index = cyclists.findIndex(c => c.id === cyclist.id);

    if (index >= 0) {
      cyclists[index] = cyclist;
      saveCyclists(cyclists);
    }
  } catch (err) {
    console.error('Error updating cyclist:', err);
    throw err;
  }
};

export const getCyclists = loadCyclists;

interface RecoveryToken {
  email: string;
  token: string;
  expiresAt: number;
}

const RECOVERY_TOKENS_KEY = 'password-recovery-tokens';

const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

export const createPasswordRecoveryToken = async (email: string): Promise<string> => {
  const cyclist = await getCyclistByEmail(email);

  if (!cyclist) {
    throw new Error('Email no registrado');
  }

  const token = generateToken();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

  const tokens: RecoveryToken[] = JSON.parse(
    localStorage.getItem(RECOVERY_TOKENS_KEY) || '[]'
  );

  const filteredTokens = tokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());

  filteredTokens.push({ email: cyclist.email, token, expiresAt });

  localStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(filteredTokens));

  return token;
};

export const validateRecoveryToken = (token: string): string | null => {
  const tokens: RecoveryToken[] = JSON.parse(
    localStorage.getItem(RECOVERY_TOKENS_KEY) || '[]'
  );

  const recoveryToken = tokens.find(t => t.token === token);

  if (!recoveryToken) {
    return null;
  }

  if (Date.now() > recoveryToken.expiresAt) {
    const filteredTokens = tokens.filter(t => t.token !== token);
    localStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(filteredTokens));
    return null;
  }

  return recoveryToken.email;
};

export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  const email = validateRecoveryToken(token);

  if (!email) {
    return false;
  }

  const cyclist = await getCyclistByEmail(email);

  if (!cyclist) {
    return false;
  }

  cyclist.password = newPassword;
  await updateCyclist(cyclist);

  const tokens: RecoveryToken[] = JSON.parse(
    localStorage.getItem(RECOVERY_TOKENS_KEY) || '[]'
  );
  const filteredTokens = tokens.filter(t => t.token !== token);
  localStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(filteredTokens));

  return true;
};

export const getCyclistByEmail = async (email: string): Promise<Cyclist | null> => {
  try {
    const { data, error } = await supabase
      .from('cyclists')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const cyclist: Cyclist = {
      id: data.id,
      name: data.name,
      alias: data.alias,
      email: data.email,
      password: data.password,
      phone: data.phone,
      city: data.city,
      country: data.country,
      age: data.age,
      weight: data.weight,
      profilePhoto: data.profile_photo,
      bikes: data.bikes || [],
      registrationDate: data.registration_date,
      isAdmin: data.is_admin,
      stravaConnected: data.strava_connected,
      stravaAthleteId: data.strava_athlete_id,
      stravaAccessToken: data.strava_access_token,
      stravaRefreshToken: data.strava_refresh_token,
      stravaTokenExpiry: data.strava_token_expiry
    };

    return cyclist;
  } catch (err) {
    console.error('Error getting cyclist by email:', err);
    return null;
  }
};
