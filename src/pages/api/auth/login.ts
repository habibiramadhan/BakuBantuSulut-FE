// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createAuthToken } from '@/lib/auth-utils';
import { login as authLogin } from '@/services/auth';
import { setCookie } from 'cookies-next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, rememberMe } = req.body;
    
    // Authenticate using your existing service
    const response = await authLogin({ email, password });
    const user = response.data.user;
    
    // Create secure token
    const token = await createAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    });
    
    // Set cookie expiration based on "remember me" option
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
    
    // Set secure HTTP-only cookie
    setCookie('auth_token', token, {
      req,
      res,
      maxAge,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Return user data (without sending token in response body for security)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user }
    });
    
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
}