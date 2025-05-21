// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Helper function to verify JWT tokens
async function verifyToken(token: string): Promise<{ valid: boolean; payload?: any }> {
  try {
    // Use JWT_SECRET from environment variables
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev');
    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;
  
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Define path patterns
  const publicPaths = ['/', '/about', '/contact', '/services', '/orphanages', '/donate', '/volunteer', '/team', '/login', '/register'];
  const dashboardPaths = ['/dashboard'];
  const adminOnlyPaths = ['/dashboard/orphanages', '/dashboard/volunteers', '/dashboard/blog', '/dashboard/programs'];
  const superAdminOnlyPaths = ['/dashboard/regions', '/dashboard/foundations', '/dashboard/admins'];
  
  // Function to check if a path matches patterns
  const pathMatches = (path: string, patterns: string[]) => {
    return patterns.some(pattern => path === pattern || path.startsWith(`${pattern}/`));
  };
  
  // Public paths - allow access without a token
  if (pathMatches(pathname, publicPaths)) {
    // For login and register pages, redirect to dashboard if already logged in
    if ((pathname === '/login' || pathname === '/register') && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Otherwise, allow access
    return NextResponse.next();
  }
  
  // For protected paths, verify the token
  if (!token) {
    // If no token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify token
  const { valid, payload } = await verifyToken(token);
  
  if (!valid) {
    // If token is invalid, delete it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
  
  // Extract user role from the token payload
  const userRole = payload?.role as string || '';
  
  // Check permissions based on path and role
  if (pathMatches(pathname, superAdminOnlyPaths)) {
    // Super Admin paths - only SUPERADMIN role can access
    if (userRole !== 'SUPERADMIN') {
      // Redirect to dashboard if not SUPERADMIN
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (pathMatches(pathname, adminOnlyPaths)) {
    // Admin paths - ADMIN and SUPERADMIN roles can access
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      // Redirect to dashboard if neither ADMIN nor SUPERADMIN
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (pathMatches(pathname, dashboardPaths)) {
    // Basic dashboard access - any authenticated user can access
    // No additional checks needed, already verified token
  }
  
  // Allow access if all checks have passed
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /images, /fonts, /favicon.ico (static files)
     */
    '/((?!api|_next|images|fonts|favicon.ico).*)',
  ],
};