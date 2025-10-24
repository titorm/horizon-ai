# Deployment Checklist - Horizon AI

## Pre-Deployment Checklist

### 1. Environment Variables Validation

#### Required Production Variables

- [ ] `APPWRITE_ENDPOINT` - Appwrite API endpoint (e.g., https://cloud.appwrite.io/v1)
- [ ] `APPWRITE_PROJECT_ID` - Your Appwrite project ID
- [ ] `APPWRITE_API_KEY` - Appwrite API key with appropriate permissions
- [ ] `APPWRITE_DATABASE_ID` - Database ID for your Appwrite database
- [ ] `JWT_SECRET` - Strong secret for JWT signing (min 32 characters)
- [ ] `JWT_EXPIRATION` - JWT token expiration (e.g., 7d)
- [ ] `JWT_REFRESH_SECRET` - Strong secret for refresh tokens (min 32 characters)
- [ ] `JWT_REFRESH_EXPIRATION` - Refresh token expiration (e.g., 30d)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `API_URL` - Production API URL (e.g., https://yourdomain.com)
- [ ] `CORS_ORIGIN` - Production domain (e.g., https://yourdomain.com)

#### Optional Production Variables

- [ ] `GEMINI_API_KEY` - Google Gemini API key (if using AI features)
- [ ] `COOKIE_SECURE` - Set to "true" for HTTPS
- [ ] `COOKIE_HTTP_ONLY` - Set to "true" (recommended)
- [ ] `COOKIE_SAME_SITE` - Set to "strict" or "lax"
- [ ] `COOKIE_MAX_AGE` - Cookie expiration in milliseconds

#### Public Variables (NEXT*PUBLIC*\*)

- [ ] `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Same as APPWRITE_ENDPOINT
- [ ] `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Same as APPWRITE_PROJECT_ID
- [ ] `NEXT_PUBLIC_API_URL` - Production API URL

### 2. Security Checklist

- [ ] All JWT secrets are strong and unique (use `openssl rand -hex 32`)
- [ ] No sensitive data in public environment variables
- [ ] CORS_ORIGIN is set to production domain only
- [ ] Cookies are configured with secure flags in production
- [ ] API keys are not exposed in client-side code
- [ ] .env files are in .gitignore
- [ ] No hardcoded credentials in codebase

### 3. Database Preparation

- [ ] Appwrite project is created and configured
- [ ] Database collections are created (run migrations)
- [ ] Database indexes are optimized
- [ ] Backup strategy is in place
- [ ] Database connection is tested from production environment

#### Run Migrations

```bash
# Check migration status
pnpm migrate:status

# Run pending migrations
pnpm migrate:up
```

### 4. Code Quality & Testing

- [ ] All TypeScript errors are resolved (`pnpm typecheck`)
- [ ] ESLint passes without errors (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Authentication flow is tested (`pnpm test:auth`)
- [ ] Accounts CRUD is tested (`pnpm test:accounts`)
- [ ] Transactions CRUD is tested (`pnpm test:transactions`)
- [ ] Credit cards CRUD is tested (`pnpm test:credit-cards`)
- [ ] All critical user flows are manually tested

### 5. Build Validation

- [ ] Production build completes successfully (`pnpm build`)
- [ ] Build output is optimized (check .next/standalone)
- [ ] No build warnings that need attention
- [ ] Bundle size is acceptable
- [ ] All pages render correctly in production mode

#### Test Production Build Locally

```bash
# Clean previous builds
pnpm clean

# Create production build
pnpm build

# Start production server
pnpm start

# Test at http://localhost:3000
```

### 6. Performance Optimization

- [ ] Images are optimized (using Next.js Image component)
- [ ] Unused dependencies are removed
- [ ] Code splitting is working correctly
- [ ] Server Components are used where appropriate
- [ ] API Routes have appropriate caching headers
- [ ] Static assets are properly cached

### 7. Monitoring & Logging

- [ ] Error tracking is configured (e.g., Sentry)
- [ ] Analytics are set up (if required)
- [ ] Logging strategy is in place
- [ ] Health check endpoint is working (`/api/health`)

## Vercel Deployment Steps

### 1. Initial Setup

1. **Connect Repository**
   - [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - [ ] Click "Add New Project"
   - [ ] Import your Git repository
   - [ ] Select the repository

2. **Configure Project**
   - [ ] Framework Preset: Next.js (auto-detected)
   - [ ] Root Directory: `./` (project root)
   - [ ] Build Command: `pnpm build` (default)
   - [ ] Output Directory: `.next` (default)
   - [ ] Install Command: `pnpm install` (default)

3. **Environment Variables**
   - [ ] Add all required environment variables from checklist above
   - [ ] Use "Production" environment for production variables
   - [ ] Use "Preview" environment for staging/preview deployments
   - [ ] Use "Development" environment for local development overrides

### 2. Deployment Configuration

- [ ] Node.js version is set to 22.x or higher
- [ ] Build & Development Settings are correct
- [ ] Domain is configured (if custom domain)
- [ ] SSL certificate is active

### 3. Deploy

- [ ] Click "Deploy" button
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors
- [ ] Verify deployment URL

### 4. Post-Deployment Verification

- [ ] Visit production URL
- [ ] Test authentication (login/register)
- [ ] Test protected routes
- [ ] Test API endpoints
- [ ] Test account creation
- [ ] Test transaction creation
- [ ] Test credit card management
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify all pages load correctly

## Post-Deployment Checklist

### 1. Functional Testing

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Protected routes are secured
- [ ] Dashboard loads with correct data
- [ ] Accounts page works (CRUD operations)
- [ ] Transactions page works (CRUD operations)
- [ ] Credit cards page works (CRUD operations)
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Error messages display properly

### 2. Performance Testing

- [ ] Page load times are acceptable (< 3s)
- [ ] Time to First Byte (TTFB) is good (< 600ms)
- [ ] Largest Contentful Paint (LCP) is good (< 2.5s)
- [ ] First Input Delay (FID) is good (< 100ms)
- [ ] Cumulative Layout Shift (CLS) is good (< 0.1)

### 3. Security Testing

- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] No sensitive data in client-side code
- [ ] Authentication tokens are secure
- [ ] CORS is properly configured
- [ ] No XSS vulnerabilities
- [ ] No SQL injection vulnerabilities

### 4. Monitoring Setup

- [ ] Error tracking is receiving events
- [ ] Performance monitoring is active
- [ ] Uptime monitoring is configured
- [ ] Alerts are configured for critical issues

## Rollback Plan

If deployment fails or critical issues are found:

1. **Immediate Rollback**
   - [ ] Go to Vercel Dashboard
   - [ ] Navigate to Deployments
   - [ ] Find previous stable deployment
   - [ ] Click "Promote to Production"

2. **Investigation**
   - [ ] Check deployment logs
   - [ ] Check error tracking service
   - [ ] Review recent code changes
   - [ ] Test locally with production environment variables

3. **Fix and Redeploy**
   - [ ] Fix identified issues
   - [ ] Test thoroughly locally
   - [ ] Create new deployment
   - [ ] Verify fix in production

## Environment-Specific Configuration

### Production

```bash
NODE_ENV=production
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
API_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
COOKIE_SECURE=true
```

### Staging/Preview

```bash
NODE_ENV=production
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
API_URL=https://staging.yourdomain.com
CORS_ORIGIN=https://staging.yourdomain.com
COOKIE_SECURE=true
```

### Development

```bash
NODE_ENV=development
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
API_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
COOKIE_SECURE=false
```

## Common Issues & Solutions

### Build Failures

**Issue**: TypeScript errors during build

- **Solution**: Run `pnpm typecheck` locally and fix all errors

**Issue**: Missing dependencies

- **Solution**: Ensure all dependencies are in `dependencies` (not `devDependencies`)

**Issue**: Environment variables not found

- **Solution**: Verify all required variables are set in Vercel dashboard

### Runtime Errors

**Issue**: 500 errors on API routes

- **Solution**: Check Vercel function logs, verify environment variables

**Issue**: Authentication not working

- **Solution**: Verify JWT_SECRET is set, check cookie configuration

**Issue**: Database connection fails

- **Solution**: Verify Appwrite credentials, check network connectivity

### Performance Issues

**Issue**: Slow page loads

- **Solution**: Enable caching, optimize images, use Server Components

**Issue**: High memory usage

- **Solution**: Check for memory leaks, optimize data fetching

## Maintenance

### Regular Tasks

- [ ] Monitor error rates daily
- [ ] Review performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Backup database regularly
- [ ] Test disaster recovery procedures

### Updates

- [ ] Test updates in staging first
- [ ] Deploy during low-traffic periods
- [ ] Monitor closely after deployment
- [ ] Have rollback plan ready

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Appwrite Support**: https://appwrite.io/support
- **Team Lead**: [Add contact]
- **DevOps**: [Add contact]

## Documentation Links

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Project README](./README.md)
- [Migration Guide](./docs/MIGRATION-GUIDE.md)

---

**Last Updated**: 2025-10-24
**Version**: 1.0.0
