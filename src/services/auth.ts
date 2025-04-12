// src/services/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  role: string;
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

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('https://baku-bantu.vercel.app/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
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