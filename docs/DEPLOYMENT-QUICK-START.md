# Deployment Quick Start Guide

## 🚀 Quick Deployment Steps

### 1. Pre-Flight Check (5 minutes)

```bash
# Validate environment variables
pnpm validate:env production

# Check TypeScript
pnpm typecheck

# Run linter
pnpm lint

# Run tests
pnpm test
```

### 2. Build Validation (2 minutes)

```bash
# Clean previous builds
pnpm clean

# Build for production
pnpm build

# Test production build locally
pnpm start
# Visit http://localhost:3000
```

### 3. Deploy to Vercel (10 minutes)

#### First Time Setup:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`

5. Add Environment Variables (copy from `.env.production.example`):

   ```
   APPWRITE_ENDPOINT
   APPWRITE_PROJECT_ID
   APPWRITE_API_KEY
   APPWRITE_DATABASE_ID
   JWT_SECRET
   JWT_REFRESH_SECRET
   API_URL
   CORS_ORIGIN
   NEXT_PUBLIC_APPWRITE_ENDPOINT
   NEXT_PUBLIC_APPWRITE_PROJECT_ID
   NEXT_PUBLIC_API_URL
   ```

6. Click "Deploy"

#### Subsequent Deployments:

```bash
# Just push to main branch
git push origin main

# Vercel will automatically deploy
```

### 4. Post-Deployment Verification (5 minutes)

```bash
# Visit your deployment URL
# Test these flows:

✓ User registration
✓ User login
✓ Dashboard loads
✓ Create account
✓ Create transaction
✓ Logout
```

## 📋 Essential Commands

```bash
# Validate environment
pnpm validate:env production

# Full production build with validation
pnpm build:production

# Test locally
pnpm dev

# Run all tests
pnpm test

# Database migrations
pnpm migrate:status
pnpm migrate:up
```

## ⚠️ Common Issues

### Build Fails

**Problem**: TypeScript or build errors

**Solution**:

```bash
pnpm typecheck  # Find TypeScript errors
pnpm lint       # Find linting errors
pnpm clean      # Clean build cache
pnpm build      # Try again
```

### Environment Variables Missing

**Problem**: "Environment variable not found" error

**Solution**:

1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure all variables from `.env.production.example` are set
3. Redeploy after adding variables

### Authentication Not Working

**Problem**: Login fails or redirects incorrectly

**Solution**:

1. Verify `JWT_SECRET` is set (min 32 chars)
2. Check `COOKIE_SECURE=true` in production
3. Verify `CORS_ORIGIN` matches your domain
4. Check `API_URL` is correct

### Database Connection Fails

**Problem**: Cannot connect to Appwrite

**Solution**:

1. Verify Appwrite credentials in Vercel
2. Check Appwrite project is accessible
3. Run migrations: `pnpm migrate:up`
4. Verify database ID is correct

## 🔐 Security Checklist

Before deploying to production:

- [ ] All secrets are strong (min 32 characters)
- [ ] `JWT_SECRET` is unique and secure
- [ ] `COOKIE_SECURE=true` in production
- [ ] `CORS_ORIGIN` is set to production domain only
- [ ] All URLs use HTTPS (not HTTP)
- [ ] No placeholder values in environment variables
- [ ] `.env` files are in `.gitignore`

## 📚 Full Documentation

For detailed information, see:

- **[DEPLOY-CHECKLIST.md](../DEPLOY-CHECKLIST.md)** - Complete deployment guide
- **[DEPLOY-PREPARATION-STATUS.md](../DEPLOY-PREPARATION-STATUS.md)** - Current status
- **.env.production.example** - Production environment template
- **scripts/validate-env.ts** - Environment validation tool

## 🆘 Need Help?

1. Check [DEPLOY-CHECKLIST.md](../DEPLOY-CHECKLIST.md) for detailed steps
2. Review [DEPLOY-PREPARATION-STATUS.md](../DEPLOY-PREPARATION-STATUS.md) for known issues
3. Run `pnpm validate:env --help` for validation options
4. Check Vercel deployment logs for errors

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ All tests pass
- ✅ Environment validation passes
- ✅ Application loads in browser
- ✅ Authentication works
- ✅ CRUD operations work
- ✅ No console errors
- ✅ Performance is acceptable

---

**Quick Links**:

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Docs](https://nextjs.org/docs)
- [Appwrite Console](https://cloud.appwrite.io/console)
