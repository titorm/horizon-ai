/**
 * Authentication utilities for Next.js 16
 * Centralized exports for JWT, session, and middleware
 */

// JWT utilities
export {
  generateJWT,
  verifyJWT,
  generateRefreshToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  type JWTPayload,
} from './jwt';

// Session utilities
export {
  getAuthToken,
  getSession,
  getCurrentUser,
  getCurrentUserId,
  requireAuth,
  isAuthenticated,
  setAuthCookie,
  setRefreshCookie,
  clearAuthCookies,
  getRefreshToken,
  validateSession,
  getUserAgent,
  getClientIP,
  createSessionResponse,
  getCookieOptions,
  SessionError,
  getSessionOrThrow,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  type SessionData,
  type CompleteUserData,
} from './session';

// Middleware utilities
export {
  isPublicRoute,
  isAuthRoute,
  isProtectedRoute,
  verifyRequestAuth,
  redirectToLogin,
  redirectToOverview,
  unauthorizedResponse,
  forbiddenResponse,
  authMiddleware,
  withAuth,
  withOptionalAuth,
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTE_PREFIX,
} from './middleware';
