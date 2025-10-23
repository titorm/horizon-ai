# Environment Configuration Summary

This document summarizes the environment variable configuration for the Horizon AI Next.js migration.

## Files Created/Updated

### 1. `.env.local` (Created)

Consolidated environment variables from:

- `apps/web/.env.local` (VITE_API_URL)
- `.env` (Appwrite, JWT, Server config)

**Key Changes:**

- Changed PORT from 8811 to 3000 (Next.js default)
- Changed API_URL to point to Next.js server (http://localhost:3000)
- Added NEXT*PUBLIC*\* variables for client-side access
- Consolidated CORS_ORIGIN to single localhost:3000

### 2. `.env.example` (Updated)

Enhanced with:

- Comprehensive documentation for all variables
- Organized sections (Appwrite, Server, API, JWT, Cookies, CORS, AI, Public)
- Instructions for generating secure secrets
- Examples for both Appwrite Cloud and Self-Hosted

### 3. `next.config.js` (Updated)

Enhanced configuration with:

- **Environment Variables**: Exposed server-side variables via `env` config
- **Turbopack**: Added configuration for SVG handling
- **CORS Headers**: Added async headers() for API route CORS support
- **Image Optimization**: Added nyc.cloud.appwrite.io to remote patterns
- **Server Actions**: Dynamic allowedOrigins from CORS_ORIGIN env var
- **Security**: Maintained removeConsole in production

### 4. `lib/config/validate-env.ts` (Created)

Environment validation module with:

- **validateEnv()**: Validates all required environment variables
- **validateAppwriteConfig()**: Validates Appwrite configuration format
- **getEnvConfig()**: Returns typed configuration object with defaults
- Production-specific validations (JWT secret strength)
- Helpful error messages with setup instructions

### 5. `lib/config/index.ts` (Created)

Main export file for configuration utilities

### 6. `lib/config/README.md` (Created)

Comprehensive documentation including:

- List of all environment variables (required and optional)
- Usage examples
- Setup instructions
- Security notes
- Troubleshooting guide

## Environment Variables Mapping

### Appwrite Configuration

| Variable             | Source | Value                            |
| -------------------- | ------ | -------------------------------- |
| APPWRITE_ENDPOINT    | .env   | https://nyc.cloud.appwrite.io/v1 |
| APPWRITE_PROJECT_ID  | .env   | 68f81e720002524dde78             |
| APPWRITE_API_KEY     | .env   | [265 chars]                      |
| APPWRITE_DATABASE_ID | .env   | 68f821b3001433efc7a4             |

### Server Configuration

| Variable | Old Value             | New Value             |
| -------- | --------------------- | --------------------- |
| PORT     | 8811                  | 3000                  |
| API_URL  | http://localhost:8811 | http://localhost:3000 |
| NODE_ENV | development           | development           |

### JWT Configuration

| Variable               | Source | Notes             |
| ---------------------- | ------ | ----------------- |
| JWT_SECRET             | .env   | 64 chars (secure) |
| JWT_EXPIRATION         | .env   | 7d                |
| JWT_REFRESH_SECRET     | .env   | 64 chars (secure) |
| JWT_REFRESH_EXPIRATION | .env   | 30d               |

### Cookie Configuration

All cookie settings preserved from original .env:

- COOKIE_MAX_AGE: 604800000 (7 days)
- COOKIE_SECURE: false (dev), true (prod)
- COOKIE_HTTP_ONLY: true
- COOKIE_SAME_SITE: lax

### CORS Configuration

| Old                                         | New                   |
| ------------------------------------------- | --------------------- |
| http://localhost:8801,http://localhost:3000 | http://localhost:3000 |

### Public Variables (New)

Added for client-side access:

- NEXT_PUBLIC_APPWRITE_ENDPOINT
- NEXT_PUBLIC_APPWRITE_PROJECT_ID
- NEXT_PUBLIC_API_URL

## Validation Features

### Startup Validation

The application validates on startup:

1. All required environment variables are present
2. Appwrite endpoint has valid format (http:// or https://)
3. JWT secret is strong enough (32+ chars in production)
4. JWT secret is not using default example value in production

### Development Warnings

In development mode, warnings are shown for:

- Missing optional environment variables
- Using default values

### Production Checks

Additional validations in production:

- JWT_SECRET must be at least 32 characters
- JWT_SECRET cannot be the example value
- Recommends using `openssl rand -hex 32` to generate secrets

## Next.js Configuration Highlights

### Environment Variable Exposure

```javascript
env: {
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
  API_URL: process.env.API_URL,
}
```

### CORS Headers for API Routes

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: process.env.CORS_ORIGIN },
        // ... more headers
      ],
    },
  ];
}
```

### Image Optimization

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { protocol: 'https', hostname: 'cloud.appwrite.io' },
    { protocol: 'https', hostname: 'nyc.cloud.appwrite.io' },
  ],
}
```

## Usage in Application

### Server-Side (API Routes, Server Components)

```typescript
import { getEnvConfig } from '@/lib/config';

const config = getEnvConfig();
// Access: config.appwrite.endpoint, config.jwt.secret, etc.
```

### Client-Side (Client Components)

```typescript
// Use NEXT_PUBLIC_* variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
```

### Validation on Startup

```typescript
import { validateAppwriteConfig, validateEnv } from '@/lib/config';

// In your main entry point or layout
validateEnv(); // Throws if invalid
await validateAppwriteConfig(); // Logs validation results
```

## Security Considerations

1. **Sensitive Data**: API keys and secrets are NOT exposed to the browser
2. **Public Variables**: Only non-sensitive config uses NEXT*PUBLIC* prefix
3. **Cookie Security**: httpOnly cookies prevent XSS attacks
4. **CORS**: Restricted to specific origins
5. **Production Secrets**: Validated for strength and uniqueness

## Migration Notes

### Breaking Changes

- Port changed from 8811 to 3000
- API URL changed to Next.js server
- CORS origin simplified to single localhost

### Backward Compatibility

- All original environment variables preserved
- Additional variables added for Next.js features
- Old .env file can be kept as reference

## Testing

Environment variables validated successfully:

```
✓ APPWRITE_ENDPOINT: Set
✓ APPWRITE_PROJECT_ID: Set
✓ APPWRITE_API_KEY: Set (265 chars)
✓ APPWRITE_DATABASE_ID: Set
✓ JWT_SECRET: Set (64 chars)
✓ JWT_EXPIRATION: Set
✓ NODE_ENV: development
✓ PORT: 3000
✓ NEXT_PUBLIC_APPWRITE_ENDPOINT: Set
✓ NEXT_PUBLIC_APPWRITE_PROJECT_ID: Set
✓ NEXT_PUBLIC_API_URL: Set
```

## Next Steps

1. ✅ Environment variables consolidated
2. ✅ Validation module created
3. ✅ Next.js configuration updated
4. ✅ Documentation created
5. ⏭️ Ready for next migration task (Task 3: Migrate types and interfaces)

## References

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Next.js Configuration](https://nextjs.org/docs/app/api-reference/next-config-js)
- [Appwrite Documentation](https://appwrite.io/docs)
