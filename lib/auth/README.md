# Authentication System

This directory contains the authentication utilities for the Next.js 16 application, migrated from the NestJS backend.

## Overview

The authentication system uses JWT (JSON Web Tokens) stored in httpOnly cookies for secure session management. It leverages Next.js 16's Async Request APIs (`await cookies()`, `await headers()`) for modern, type-safe request handling.

## Files

### `jwt.ts`

JWT token generation and verification utilities.

**Key Functions:**

- `generateJWT(payload)` - Generate access token
- `verifyJWT(token)` - Verify and decode access token
- `generateRefreshToken(payload)` - Generate refresh token
- `verifyRefreshToken(token)` - Verify refresh token
- `extractTokenFromHeader(authHeader)` - Extract Bearer token from header

### `session.ts`

Session management using Next.js 16 Async Request APIs.

**Key Functions:**

- `getSession()` - Get current session data
- `getCurrentUser()` - Get authenticated user payload
- `getCurrentUserId()` - Get current user ID
- `requireAuth()` - Require authentication (throws if not authenticated)
- `isAuthenticated()` - Check if user is authenticated
- `setAuthCookie(token)` - Set authentication cookie
- `clearAuthCookies()` - Clear auth cookies (logout)
- `validateSession()` - Validate session or throw error

### `middleware.ts`

Middleware utilities for route protection.

**Key Functions:**

- `isPublicRoute(pathname)` - Check if route is public
- `isProtectedRoute(pathname)` - Check if route requires auth
- `verifyRequestAuth(request)` - Verify auth from request
- `authMiddleware(request)` - Main middleware handler
- `withAuth(handler)` - Wrap API route with auth requirement
- `withOptionalAuth(handler)` - Wrap API route with optional auth

### `index.ts`

Centralized exports for all authentication utilities.

## Usage Examples

### Server Components

```typescript
import { getCurrentUser, requireAuth } from '@/lib/auth';

// Optional authentication
export default async function MyPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.email}</div>;
}

// Required authentication
export default async function ProtectedPage() {
  const user = await requireAuth(); // Throws if not authenticated

  return <div>Welcome, {user.email}</div>;
}
```

### API Routes

```typescript
import { getCurrentUserId, requireAuth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Get user ID
    const userId = await getCurrentUserId();

    // Your logic here
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### Using withAuth Wrapper

```typescript
import { withAuth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(async (request, context) => {
  // User is guaranteed to be authenticated
  const { user } = context;

  return NextResponse.json({
    message: 'Protected data',
    userId: user.sub,
  });
});
```

### Server Actions

```typescript
'use server';

import { clearAuthCookies, requireAuth, setAuthCookie } from '@/lib/auth';
import { generateJWT } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate credentials (your logic)
  const user = await validateCredentials(email, password);

  // Generate JWT
  const token = await generateJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  // Set cookie
  await setAuthCookie(token);

  return { success: true };
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect('/login');
}

export async function getProfileAction() {
  const user = await requireAuth();

  // Fetch user profile
  return { userId: user.sub, email: user.email };
}
```

### Middleware (app/middleware.ts)

```typescript
import { authMiddleware } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await authMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Environment Variables

Required environment variables:

```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=30d

# Cookie Configuration
COOKIE_MAX_AGE=604800000
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax
```

## Security Features

1. **httpOnly Cookies**: Tokens stored in httpOnly cookies prevent XSS attacks
2. **Secure Flag**: Enabled in production for HTTPS-only transmission
3. **SameSite**: Configured to prevent CSRF attacks
4. **Token Expiration**: Access tokens expire after 7 days (configurable)
5. **Refresh Tokens**: Long-lived tokens for seamless re-authentication
6. **Token Verification**: All tokens verified using HMAC SHA-256

## Migration Notes

This authentication system was migrated from NestJS with the following changes:

1. **Passport.js → Native JWT**: Replaced Passport strategies with native JWT handling using `jose` library
2. **Guards → Middleware**: NestJS guards converted to Next.js middleware
3. **Decorators → Functions**: `@UseGuards()` replaced with `requireAuth()` and `withAuth()`
4. **Sync → Async**: All cookie/header access now uses `await` (Next.js 16 requirement)
5. **Request Context**: User data passed through function returns instead of request decoration

## Token Structure

### Access Token Payload

```typescript
{
  sub: string;      // User ID
  email: string;    // User email
  name?: string;    // User name
  iat: number;      // Issued at (timestamp)
  exp: number;      // Expiration (timestamp)
}
```

### Refresh Token Payload

```typescript
{
  sub: string; // User ID
  email: string; // User email
  type: 'refresh'; // Token type
  iat: number; // Issued at
  exp: number; // Expiration
}
```

## Error Handling

The system provides custom error types for better error handling:

```typescript
import { SessionError } from '@/lib/auth';

try {
  const session = await getSessionOrThrow();
} catch (error) {
  if (error instanceof SessionError) {
    switch (error.code) {
      case 'MISSING':
        // No token found
        break;
      case 'EXPIRED':
        // Token expired
        break;
      case 'INVALID':
        // Invalid token
        break;
      case 'UNAUTHORIZED':
        // General auth failure
        break;
    }
  }
}
```

## Best Practices

1. **Use Server Components**: Fetch user data in Server Components when possible
2. **Require Auth Early**: Call `requireAuth()` at the start of protected routes
3. **Handle Errors**: Always wrap auth calls in try-catch blocks
4. **Clear Cookies on Logout**: Use `clearAuthCookies()` for proper logout
5. **Validate on Every Request**: Never trust client-side auth state
6. **Use Refresh Tokens**: Implement token refresh for better UX
7. **Log Security Events**: Log failed auth attempts and suspicious activity

## Testing

To test authentication:

```typescript
// Test token generation
const token = await generateJWT({
  userId: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
});

// Test token verification
const payload = await verifyJWT(token);
console.log(payload); // { sub: 'test-user-id', email: 'test@example.com', ... }

// Test session in API route
const user = await getCurrentUser();
console.log(user); // JWT payload or null
```

## Future Enhancements

- [ ] Implement token refresh flow
- [ ] Add rate limiting for auth endpoints
- [ ] Implement 2FA support
- [ ] Add session management (list active sessions)
- [ ] Implement "remember me" functionality
- [ ] Add OAuth providers (Google, GitHub, etc.)
- [ ] Implement password reset flow
- [ ] Add email verification flow
