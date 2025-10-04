import { Cyclist } from '../types';

const CYCLISTS_STORAGE_KEY = 'mountain-pass-cyclists';

export const saveCyclists = (cyclists: Cyclist[]): void => {
  localStorage.setItem(CYCLISTS_STORAGE_KEY, JSON.stringify(cyclists));
};

export const loadCyclists = (): Cyclist[] => {
  const stored = localStorage.getItem(CYCLISTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getCurrentUser = (): Cyclist | null => {
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return null;
  
  const cyclists = loadCyclists();
  return cyclists.find(c => c.id === currentUserId) || null;
};

export const authenticateUser = (email: string, password: string): Cyclist | null => {
  const cyclists = loadCyclists();
  const cyclist = cyclists.find(c => 
    c.email.toLowerCase() === email.toLowerCase() && 
    c.password === password
  );
  return cyclist || null;
};

export const loginUser = (email: string, password: string): boolean => {
  const cyclist = authenticateUser(email, password);
  if (cyclist) {
    setCurrentUser(cyclist.id);
    return true;
  }
  return false;
};
export const setCurrentUser = (cyclistId: string): void => {
  localStorage.setItem('currentUserId', cyclistId);
};

export const isCurrentUserAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  // Solo permitir acceso admin si hay usuario actual Y es admin
  if (!currentUser) {
    return false;
  }
  return currentUser?.isAdmin || false;
};

export const addCyclist = (cyclist: Cyclist): void => {
  const cyclists = loadCyclists();
  const existingIndex = cyclists.findIndex(c => c.id === cyclist.id);
  
  if (existingIndex >= 0) {
    cyclists[existingIndex] = cyclist;
  } else {
    cyclists.push(cyclist);
  }
  
  saveCyclists(cyclists);
};

export const removeCyclist = (cyclistId: string): void => {
  const cyclists = loadCyclists();
  const filteredCyclists = cyclists.filter(c => c.id !== cyclistId);
  saveCyclists(filteredCyclists);
};

export const updateCyclist = (cyclist: Cyclist): void => {
  const cyclists = loadCyclists();
  const index = cyclists.findIndex(c => c.id === cyclist.id);
  
  if (index >= 0) {
    cyclists[index] = cyclist;
    saveCyclists(cyclists);
  }
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

export const createPasswordRecoveryToken = (email: string): string => {
  const cyclists = loadCyclists();
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

export const resetPassword = (token: string, newPassword: string): boolean => {
  const email = validateRecoveryToken(token);

  if (!email) {
    return false;
  }

  const cyclists = loadCyclists();
  const cyclist = cyclists.find(c => c.email.toLowerCase() === email.toLowerCase());

  if (!cyclist) {
    return false;
  }

  // Update password
  cyclist.password = newPassword;
  updateCyclist(cyclist);

  // Remove used token
  const tokens: RecoveryToken[] = JSON.parse(
    localStorage.getItem(RECOVERY_TOKENS_KEY) || '[]'
  );
  const filteredTokens = tokens.filter(t => t.token !== token);
  localStorage.setItem(RECOVERY_TOKENS_KEY, JSON.stringify(filteredTokens));

  return true;
};

export const getCyclistByEmail = (email: string): Cyclist | null => {
  const cyclists = loadCyclists();
  return cyclists.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
};