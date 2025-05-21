// src/lib/auth-utils.ts
import { jwtVerify, SignJWT } from 'jose';

/**
 * Verifies a JWT token
 * @param token JWT token to verify
 * @returns Object with validation result and payload if valid
 */
export async function verifyAuthToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev');
    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false, payload: null };
  }
}

/**
 * Creates a JWT token
 * @param payload Data to include in the token
 * @param expiresIn Expiration time (e.g., '1d' for one day)
 * @returns JWT token string
 */
export async function createAuthToken(payload: any, expiresIn: string = '1d') {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev');
  
  // Calculate expiration time
  const exp = Math.floor(Date.now() / 1000) + 
    (expiresIn.endsWith('d') 
      ? parseInt(expiresIn.slice(0, -1)) * 24 * 60 * 60 
      : expiresIn.endsWith('h') 
        ? parseInt(expiresIn.slice(0, -1)) * 60 * 60 
        : 24 * 60 * 60); // Default: 1 day
  
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .setIssuedAt()
    .sign(secret);
  
  return token;
}