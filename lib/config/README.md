# Configuration Module

This module handles environment variable validation and configuration management for the Horizon AI application.

## Environment Variables

### Required Variables

These variables **must** be set for the application to run:

- `APPWRITE_ENDPOINT` - Appwrite API endpoint (e.g., https://cloud.appwrite.io/v1)
- `APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `APPWRITE_API_KEY` - Appwrite API key for server-side operations
- `APPWRITE_DATABASE_ID` - Database ID in Appwrite
- `JWT_SECRET` - Secret key for JWT token signing (min 32 chars in production)
- `JWT_EXPIRATION` - JWT token expiration time (e.g., 7d)
- `NODE_ENV` - Environment (development, production, test)

### Optional Variables

These variables have default values but can be customized:

- `JWT_REFRESH_SECRET` - Refresh token secret (defaults to JWT_SECRET)
- `JWT_REFRESH_EXPIRATION` - Refresh token expiration (default: 30d)
- `PORT` - Server port (default: 3000)
- `API_URL` - Base API URL (default: http://localhost:3000)
- `COOKIE_MAX_AGE` - Cookie max age in ms (default: 604800000 = 7 days)
- `COOKIE_SECURE` - Use secure cookies (default: false in dev, true in prod)
- `COOKIE_HTTP_ONLY` - HTTP-only cookies (default: true)
- `COOKIE_SAME_SITE` - SameSite cookie policy (default: lax)
- `CORS_ORIGIN` - Allowed CORS origins, comma-separated (default: http://localhost:3000)
- `GEMINI_API_KEY` - Google Gemini AI API key (optional)

### Public Variables

These variables are exposed to the browser (prefix with `NEXT_PUBLIC_`):

- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite endpoint for client-side SDK
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Project ID for client-side SDK
- `NEXT_PUBLIC_API_URL` - API base URL for client-side requests

## Usage

### Validating Environment Variables

```typescript
import { validateEnv } from '@/lib/config';

// Validate all required environment variables
// Throws an error if any required variable is missing
const env = validateEnv();
```

### Getting Configuration

```typescript
import { getEnvConfig } from '@/lib/config';

const config = getEnvConfig();

// Access configuration
console.log(config.appwrite.endpoint);
console.log(config.jwt.secret);
console.log(config.server.port);
```

### Validating Appwrite Configuration

```typescript
import { validateAppwriteConfig } from '@/lib/config';

// Validate Appwrite configuration
// Logs configuration details and checks format
await validateAppwriteConfig();
```

## File Structure

```
lib/config/
├── index.ts           # Main exports
├── validate-env.ts    # Environment validation logic
└── README.md          # This file
```

## Setup Instructions

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Appwrite credentials and other configuration values

3. Generate secure JWT secrets for production:

   ```bash
   openssl rand -hex 32
   ```

4. The application will automatically validate environment variables on startup

## Security Notes

- Never commit `.env.local` to version control
- Use strong, randomly generated secrets for JWT in production
- Keep API keys secure and rotate them regularly
- Use `NEXT_PUBLIC_` prefix only for non-sensitive data that can be exposed to the browser
- In production, always use HTTPS and set `COOKIE_SECURE=true`

## Troubleshooting

### Missing Environment Variables

If you see an error about missing environment variables:

1. Check that `.env.local` exists in the project root
2. Verify all required variables are set
3. Restart the development server after changing environment variables

### Invalid Appwrite Endpoint

The endpoint must start with `http://` or `https://`. Example:

- ✅ `https://cloud.appwrite.io/v1`
- ✅ `http://localhost/v1`
- ❌ `cloud.appwrite.io/v1`

### JWT Secret Too Short

In production, JWT secrets must be at least 32 characters long. Generate a secure secret:

```bash
openssl rand -hex 32
```
