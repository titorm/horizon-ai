/**
 * Session management utilities for Next.js 16
 * Uses Async Request APIs (await cookies(), await headers())
 * Migrated from NestJS authentication guards
 */
import type { User, UserPreferences, UserProfile, UserSettings } from '@/lib/types';
import { cookies, headers } from 'next/headers';

import { type JWTPayload, extractTokenFromHeader, verifyJWT } from './jwt';

/**
 * Cookie configuration for authentication tokens
 */
export const AUTH_COOKIE_NAME = 'auth_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';

/**
 * Get cookie options based on environment
 */
export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = parseInt(process.env.COOKIE_MAX_AGE || '604800000', 10); // 7 days in ms

  return {
    httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
    secure: process.env.COOKIE_SECURE === 'true' || isProduction,
    sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'strict' | 'lax' | 'none',
    maxAge: Math.floor(maxAge / 1000), // Convert to seconds for cookie
    path: '/',
  };
}

/**
 * Session data structure
 */
export interface SessionData {
  user: JWTPayload;
  isAuthenticated: boolean;
}

/**
 * Complete user data structure (from database)
 */
export interface CompleteUserData {
  auth: JWTPayload;
  user?: User;
  profile?: UserProfile;
  preferences?: UserPreferences;
  settings?: UserSettings;
}

/**
 * Get authentication token from cookies or headers
 * Uses Next.js 16 Async Request APIs
 * @returns Token string or null
 */
export async function getAuthToken(): Promise<string | null> {
  // Try to get token from cookies first (primary method)
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // Fallback to Authorization header (for API clients)
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  return extractTokenFromHeader(authHeader);
}

/**
 * Get current session from authentication token
 * @returns Session data or null if not authenticated
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);

    return {
      user: payload,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Get current authenticated user
 * @returns JWT payload or null if not authenticated
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Get current user ID
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.sub || null;
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in Server Components or API Routes that require auth
 * @returns JWT payload
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized - Authentication required');
  }

  return user;
}

/**
 * Check if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session?.isAuthenticated || false;
}

/**
 * Set authentication cookie
 * Uses Next.js 16 Async Request APIs
 * @param token - JWT token to store
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const options = getCookieOptions();

  cookieStore.set(AUTH_COOKIE_NAME, token, options);
}

/**
 * Set refresh token cookie
 * @param token - Refresh token to store
 */
export async function setRefreshCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const options = getCookieOptions();

  // Refresh token has longer expiration
  const refreshMaxAge = parseInt(process.env.JWT_REFRESH_EXPIRATION || '30d', 10);

  cookieStore.set(REFRESH_COOKIE_NAME, token, {
    ...options,
    maxAge: refreshMaxAge,
  });
}

/**
 * Clear authentication cookies (logout)
 * Uses Next.js 16 Async Request APIs
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

/**
 * Get refresh token from cookies
 * @returns Refresh token or null
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
}

/**
 * Validate session and return user data
 * This is a helper for API routes and Server Components
 * @returns Session data or throws error
 */
export async function validateSession(): Promise<SessionData> {
  const session = await getSession();

  if (!session || !session.isAuthenticated) {
    throw new Error('Invalid or expired session');
  }

  return session;
}

/**
 * Get user agent from request headers
 * Useful for security logging
 * @returns User agent string or null
 */
export async function getUserAgent(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('user-agent');
}

/**
 * Get client IP address from request headers
 * Useful for security logging and rate limiting
 * @returns IP address or null
 */
export async function getClientIP(): Promise<string | null> {
  const headersList = await headers();

  // Try various headers that might contain the real IP
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return null;
}

/**
 * Create session response helper
 * Returns formatted session data for API responses
 * @param user - JWT payload
 * @returns Formatted session response
 */
export function createSessionResponse(user: JWTPayload) {
  return {
    user: {
      id: user.sub,
      email: user.email,
      name: user.name,
    },
    isAuthenticated: true,
  };
}

/**
 * Session error types for better error handling
 */
export class SessionError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'EXPIRED' | 'INVALID' | 'MISSING',
  ) {
    super(message);
    this.name = 'SessionError';
  }
}

/**
 * Get session with detailed error handling
 * @returns Session data
 * @throws SessionError with specific error code
 */
export async function getSessionOrThrow(): Promise<SessionData> {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new SessionError('No authentication token found', 'MISSING');
    }

    const payload = await verifyJWT(token);

    return {
      user: payload,
      isAuthenticated: true,
    };
  } catch (error) {
    if (error instanceof SessionError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw new SessionError('Session has expired', 'EXPIRED');
      }
      if (error.message.includes('invalid')) {
        throw new SessionError('Invalid session token', 'INVALID');
      }
    }

    throw new SessionError('Authentication failed', 'UNAUTHORIZED');
  }
}
