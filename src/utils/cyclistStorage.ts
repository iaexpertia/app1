import { Cyclist } from '../types';
import { supabase } from './supabaseClient';

const CYCLISTS_STORAGE_KEY = 'mountain-pass-cyclists';

export const saveCyclists = (cyclists: Cyclist[]): void => {
  localStorage.setItem(CYCLISTS_STORAGE_KEY, JSON.stringify(cyclists));
};

export const loadCyclists = async (): Promise<Cyclist[]> => {
  const { data, error } = await supabase
    .from('cyclists')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error loading cyclists:', error);
    return [];
  }

  return (data || []).map(cyclist => ({
    id: cyclist.id,
    email: cyclist.email,
    password: cyclist.password,
    name: cyclist.name,
    isAdmin: cyclist.is_admin
  }));
};

export const getCurrentUser = async (): Promise<Cyclist | null> => {
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return null;

  const cyclists = await loadCyclists();
  return cyclists.find(c => c.id === currentUserId) || null;
};

export const authenticateUser = async (email: string, password: string): Promise<Cyclist | null> => {
  const { data, error } = await supabase
    .from('cyclists')
    .select('*')
    .ilike('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    password: data.password,
    name: data.name,
    isAdmin: data.is_admin
  };
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  const cyclist = await authenticateUser(email, password);
  if (cyclist) {
    setCurrentUser(cyclist.id);
    return true;
  }
  return false;
};
export const setCurrentUser = (cyclistId: string): void => {
  localStorage.setItem('currentUserId', cyclistId);
};

export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return false;
  }
  return currentUser?.isAdmin || false;
};

export const addCyclist = async (cyclist: Cyclist): Promise<boolean> => {
  const { error } = await supabase
    .from('cyclists')
    .insert({
      email: cyclist.email,
      password: cyclist.password,
      name: cyclist.name,
      is_admin: cyclist.isAdmin || false
    });

  if (error) {
    console.error('Error adding cyclist:', error);
    return false;
  }

  return true;
};

export const removeCyclist = async (cyclistId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cyclists')
    .delete()
    .eq('id', cyclistId);

  if (error) {
    console.error('Error removing cyclist:', error);
    return false;
  }

  return true;
};

export const updateCyclist = async (cyclist: Cyclist): Promise<boolean> => {
  const { error } = await supabase
    .from('cyclists')
    .update({
      email: cyclist.email,
      password: cyclist.password,
      name: cyclist.name,
      is_admin: cyclist.isAdmin,
      updated_at: new Date().toISOString()
    })
    .eq('id', cyclist.id);

  if (error) {
    console.error('Error updating cyclist:', error);
    return false;
  }

  return true;
};

// Alias for getCyclists (for compatibility)
export const getCyclists = loadCyclists;

// Password recovery token management
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
  const cyclists = await loadCyclists();
  const cyclist = cyclists.find(c => c.email.toLowerCase() === email.toLowerCase());

  if (!cyclist) {
    throw new Error('Email no registrado');
  }

  const token = generateToken();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

  const tokens: RecoveryToken[] = JSON.parse(
    localStorage.getItem(RECOVERY_TOKENS_KEY) || '[]'
  );

  // Remove old tokens for this email
  const filteredTokens = tokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());

  // Add new token
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
    // Token expired, remove it
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

  const cyclists = await loadCyclists();
  const cyclist = cyclists.find(c => c.email.toLowerCase() === email.toLowerCase());

  if (!cyclist) {
    return false;
  }

  // Update password
  cyclist.password = newPassword;
  await updateCyclist(cyclist);

  // Remove used token
  const tokens: RecoveryToken[] = JSON.parse(
    localStorage.getItem(RECOVERY_TOKENS_KEY) || '[]'
  );
  const filteredTokens = tokens.filter(t => t.token !== token);
  localStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(filteredTokens));

  return true;
};

export const getCyclistByEmail = async (email: string): Promise<Cyclist | null> => {
  const cyclists = await loadCyclists();
  return cyclists.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
};

export const ensureAdminExists = async (): Promise<void> => {
  const { data } = await supabase
    .from('cyclists')
    .select('*')
    .ilike('email', 'webvalles@gmail.com')
    .maybeSingle();

  if (!data) {
    await supabase
      .from('cyclists')
      .insert({
        email: 'webvalles@gmail.com',
        password: 'JundioX1979',
        name: 'Administrador',
        is_admin: true
      });
  }
};