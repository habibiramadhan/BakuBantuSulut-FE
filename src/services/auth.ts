// src/services/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
  role: 'ADMIN' | 'SUPERADMIN';
  region?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Mock login function for development
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // In production, this would be an API call
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate authentication
      if (credentials.email === 'admin@bakubantu.id' && credentials.password === 'password123') {
        const response: LoginResponse = {
          message: 'Login successful',
          data: {
            user: {
              id: '1',
              username: 'Admin',
              email: 'admin@bakubantu.id',
              profileImage: null,
              role: 'ADMIN',
              region: 'DKI Jakarta',
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-01T00:00:00.000Z',
              createdBy: null
            },
            token: 'mock-jwt-token-for-admin'
          }
        };
        resolve(response);
      } else if (credentials.email === 'superadmin@bakubantu.id' && credentials.password === 'password123') {
        const response: LoginResponse = {
          message: 'Login successful',
          data: {
            user: {
              id: '2',
              username: 'Super Admin',
              email: 'superadmin@bakubantu.id',
              profileImage: null,
              role: 'SUPERADMIN',
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-01T00:00:00.000Z',
              createdBy: null
            },
            token: 'mock-jwt-token-for-superadmin'
          }
        };
        resolve(response);
      } else {
        reject(new Error('Email atau password salah. Silakan coba lagi.'));
      }
    }, 1000);
  });
}

export function logout(): void {
  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  
  // Clear the cookie
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
}

export function isAuthenticated(): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('auth_token');
}

export function getToken(): string | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth_token');
}

export function getUser(): User | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const userJson = localStorage.getItem('user_info');
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
}

export function setAuthData(token: string, user: User): void {
  // Store in localStorage for client-side access
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_info', JSON.stringify(user));
  
  // Also set a cookie for the middleware
  document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

export function hasPermission(requiredRole: 'ADMIN' | 'SUPERADMIN'): boolean {
  const user = getUser();
  if (!user) return false;
  
  // SUPERADMIN has access to everything
  if (user.role === 'SUPERADMIN') return true;
  
  // ADMIN only has access to ADMIN level permissions
  if (user.role === 'ADMIN' && requiredRole === 'ADMIN') return true;
  
  return false;
}