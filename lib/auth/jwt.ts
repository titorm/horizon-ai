/**
 * JWT utilities for Next.js authentication
 * Migrated from NestJS JWT strategy
 */
import { SignJWT, jwtVerify } from 'jose';

/**
 * JWT payload structure
 */
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  name?: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

/**
 * Generate a JWT token for authenticated user
 * @param payload - User data to encode in token
 * @returns JWT token string
 */
export async function generateJWT(payload: { userId: string; email: string; name?: string }): Promise<string> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const expirationTime = process.env.JWT_EXPIRATION || '7d';

  // Convert expiration time to seconds
  const expirationSeconds = parseExpirationTime(expirationTime);

  try {
    const token = await new SignJWT({
      sub: payload.userId,
      email: payload.email,
      name: payload.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expirationSeconds)
      .sign(new TextEncoder().encode(secret));

    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Failed to generate authentication token');
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export async function verifyJWT(token: string): Promise<JWTPayload> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw new Error('Token has expired');
      }
      if (error.message.includes('signature')) {
        throw new Error('Invalid token signature');
      }
    }
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate a refresh token with longer expiration
 * @param payload - User data to encode in token
 * @returns Refresh token string
 */
export async function generateRefreshToken(payload: { userId: string; email: string }): Promise<string> {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  const expirationTime = process.env.JWT_REFRESH_EXPIRATION || '30d';
  const expirationSeconds = parseExpirationTime(expirationTime);

  try {
    const token = await new SignJWT({
      sub: payload.userId,
      email: payload.email,
      type: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expirationSeconds)
      .sign(new TextEncoder().encode(secret));

    return token;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
}

/**
 * Verify a refresh token
 * @param token - Refresh token string
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Parse expiration time string to seconds
 * Supports formats like: '7d', '24h', '60m', '3600s', or raw seconds
 * @param expirationTime - Expiration time string
 * @returns Expiration time in seconds
 */
function parseExpirationTime(expirationTime: string): number {
  const match = expirationTime.match(/^(\d+)([dhms])$/);

  if (!match) {
    // Try to parse as raw seconds
    const seconds = parseInt(expirationTime, 10);
    if (!isNaN(seconds)) {
      return seconds;
    }
    // Default to 7 days if invalid format
    return 7 * 24 * 60 * 60;
  }

  const [, value, unit] = match;
  const numValue = parseInt(value, 10);

  switch (unit) {
    case 'd': // days
      return numValue * 24 * 60 * 60;
    case 'h': // hours
      return numValue * 60 * 60;
    case 'm': // minutes
      return numValue * 60;
    case 's': // seconds
      return numValue;
    default:
      return 7 * 24 * 60 * 60; // Default 7 days
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
