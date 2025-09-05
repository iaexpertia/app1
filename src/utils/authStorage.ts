const AUTH_STORAGE_KEY = 'mountain-pass-auth';
const CURRENT_USER_KEY = 'current-user-session';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
  loginTime: string;
}

export const saveAuthUser = (user: AuthUser): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(CURRENT_USER_KEY, user.id);
};

export const getCurrentAuthUser = (): AuthUser | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  
  const user: AuthUser = JSON.parse(stored);
  
  // Verificar si la sesión sigue siendo válida (24 horas)
  const loginTime = new Date(user.loginTime);
  const now = new Date();
  const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff > 24) {
    logout();
    return null;
  }
  
  return user.isLoggedIn ? user : null;
};

export const isUserLoggedIn = (): boolean => {
  const user = getCurrentAuthUser();
  return user !== null && user.isLoggedIn;
};

export const login = (email: string, name: string): AuthUser => {
  const user: AuthUser = {
    id: Date.now().toString(),
    email,
    name,
    isLoggedIn: true,
    loginTime: new Date().toISOString()
  };
  
  saveAuthUser(user);
  return user;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  // Disparar evento para notificar el logout
  window.dispatchEvent(new CustomEvent('userLoggedOut'));
};

export const updateAuthUser = (updates: Partial<AuthUser>): void => {
  const currentUser = getCurrentAuthUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    saveAuthUser(updatedUser);
  }
};