# Migration Guide: Turborepo to Next.js 16

This guide documents the migration from a Turborepo monorepo architecture (separate `apps/web` and `apps/api`) to a unified Next.js 16 monolithic application with React 19.2.

## Table of Contents

- [Overview](#overview)
- [Architecture Changes](#architecture-changes)
- [Breaking Changes](#breaking-changes)
- [Migration Details](#migration-details)
- [React 19.2 Changes](#react-192-changes)
- [Code Location Mapping](#code-location-mapping)
- [Troubleshooting](#troubleshooting)

## Overview

### Why Migrate?

The migration from Turborepo to Next.js 16 provides several benefits:

1. **Simplified Architecture** - Single application instead of multiple packages
2. **Better Performance** - Turbopack, React Compiler, and Server Components
3. **Improved DX** - Unified development experience with hot reload
4. **Easier Deployment** - Single deployment target instead of multiple services
5. **Modern Features** - React 19.2 Actions, Server Components, and PPR
6. **Reduced Complexity** - No need to manage monorepo tooling

### What Changed?

- **Frontend**: React/Vite app → Next.js 16 App Router
- **Backend**: NestJS API → Next.js API Routes + Server Actions
- **Routing**: React Router → Next.js file-based routing
- **State Management**: Client-side only → Server + Client with React 19.2
- **Build Tool**: Vite + Webpack → Turbopack
- **Deployment**: Separate deployments → Single Vercel deployment

## Architecture Changes

### Before: Turborepo Monorepo

```
horizon-ai/
├── apps/
│   ├── web/                    # React + Vite frontend
│   │   ├── src/
│   │   │   ├── screens/        # Page components
│   │   │   ├── components/     # UI components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   └── config/         # Configuration
│   │   └── package.json
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── auth/           # Auth module
│       │   ├── database/       # Database services
│       │   ├── transactions/   # Transaction module
│       │   └── users/          # User module
│       └── package.json
│
├── packages/                   # Shared packages
├── turbo.json                  # Turborepo config
└── pnpm-workspace.yaml         # Workspace config
```

### After: Next.js 16 Monolith

```
horizon-ai/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Public routes
│   ├── (app)/                  # Protected routes
│   ├── api/                    # API Routes
│   └── layout.tsx
│
├── components/                 # React components
├── lib/                        # Utilities & services
├── hooks/                      # Custom hooks
├── actions/                    # Server Actions
├── middleware.ts               # Auth middleware
└── package.json                # Single package.json
```

## Breaking Changes

### 1. Import Paths

**Before (Turborepo):**

```typescript
// In apps/web
import { Button } from '../components/ui/Button';
import { useAccounts } from '../hooks/useAccounts';
// In apps/api
import { AuthService } from './auth/auth.service';
```

**After (Next.js):**

```typescript
// Anywhere in the app
import { Button } from '@/components/ui/Button';
import { useAccounts } from '@/hooks/useAccounts';
import { AuthService } from '@/lib/services/auth.service';
```

### 2. Routing

**Before (React Router):**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/dashboard" element={<DashboardScreen />} />
  </Routes>
</BrowserRouter>
```

**After (Next.js App Router):**

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx          # /login route
└── (app)/
    └── dashboard/
        └── page.tsx          # /dashboard route
```

### 3. API Calls

**Before (Separate API Server):**

```typescript
// Frontend calls external API
const response = await fetch('http://localhost:8811/api/accounts', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**After (API Routes):**

```typescript
// Frontend calls same-origin API
const response = await fetch('/api/accounts', {
  credentials: 'include', // Cookies sent automatically
});
```

### 4. Authentication

**Before (JWT in localStorage):**

```typescript
// Store token in localStorage
localStorage.setItem('token', token);

// Send in Authorization header
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

**After (httpOnly Cookies):**

```typescript
// Server sets httpOnly cookie
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
});

// Automatically sent with requests
fetch('/api/accounts', { credentials: 'include' });
```

### 5. Environment Variables

**Before (Multiple .env files):**

```
apps/web/.env.local          # Frontend env vars
apps/api/.env                # Backend env vars
```

**After (Single .env.local):**

```
.env.local                   # All env vars in one place
```

**Variable Naming:**

- Client-side: Must use `NEXT_PUBLIC_` prefix
- Server-side: No prefix needed

## Migration Details

### Frontend Migration

#### Screens → Pages

All screen components were converted to Next.js pages:

| Old Location                                  | New Location                      | Route           |
| --------------------------------------------- | --------------------------------- | --------------- |
| `apps/web/src/screens/LoginScreen.tsx`        | `app/(auth)/login/page.tsx`       | `/login`        |
| `apps/web/src/screens/DashboardScreen.tsx`    | `app/(app)/overview/page.tsx`     | `/overview`     |
| `apps/web/src/screens/AccountsScreen.tsx`     | `app/(app)/accounts/page.tsx`     | `/accounts`     |
| `apps/web/src/screens/TransactionsScreen.tsx` | `app/(app)/transactions/page.tsx` | `/transactions` |

#### Components

UI components were moved to the root-level `components/` directory:

| Old Location                       | New Location          |
| ---------------------------------- | --------------------- |
| `apps/web/src/components/ui/*`     | `components/ui/*`     |
| `apps/web/src/components/layout/*` | `components/layout/*` |
| `apps/web/src/components/modals/*` | `components/modals/*` |

#### Hooks

Custom hooks were moved and updated for React 19.2:

| Old Location                            | New Location               | Changes                  |
| --------------------------------------- | -------------------------- | ------------------------ |
| `apps/web/src/hooks/useAccounts.ts`     | `hooks/useAccounts.ts`     | Added `use` hook support |
| `apps/web/src/hooks/useTransactions.ts` | `hooks/useTransactions.ts` | Added `useOptimistic`    |
| `apps/web/src/hooks/useCreditCards.ts`  | `hooks/useCreditCards.ts`  | Updated API endpoints    |

### Backend Migration

#### NestJS Services → Next.js Services

NestJS services were converted to plain TypeScript functions:

| Old Location                                                     | New Location                          | Changes                        |
| ---------------------------------------------------------------- | ------------------------------------- | ------------------------------ |
| `apps/api/src/auth/auth.service.ts`                              | `lib/services/auth.service.ts`        | Removed decorators, kept logic |
| `apps/api/src/database/services/appwrite-account.service.ts`     | `lib/services/account.service.ts`     | Simplified to functions        |
| `apps/api/src/database/services/appwrite-transaction.service.ts` | `lib/services/transaction.service.ts` | Removed NestJS dependencies    |

#### NestJS Controllers → API Routes

Controllers were converted to Next.js API Routes:

| Old Location                                               | New Location                    | Method    |
| ---------------------------------------------------------- | ------------------------------- | --------- |
| `apps/api/src/auth/auth.controller.ts`                     | `app/api/auth/sign-in/route.ts` | POST      |
| `apps/api/src/database/controllers/accounts.controller.ts` | `app/api/accounts/route.ts`     | GET, POST |
| `apps/api/src/transactions/transactions.controller.ts`     | `app/api/transactions/route.ts` | GET, POST |

**Example Conversion:**

**Before (NestJS Controller):**

```typescript
@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAccounts(@Request() req) {
    return this.accountService.findByUserId(req.user.id);
  }
}
```

**After (Next.js API Route):**

```typescript
// app/api/accounts/route.ts
import { getCurrentUser } from '@/lib/auth/session';
import { getAccountsByUserId } from '@/lib/services/account.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accounts = await getAccountsByUserId(user.id);
  return NextResponse.json(accounts);
}
```

#### Database Migrations

Migration system was preserved with minimal changes:

| Old Location                              | New Location                     |
| ----------------------------------------- | -------------------------------- |
| `apps/api/src/database/migrations/*`      | `lib/database/migrations/*`      |
| `apps/api/src/database/migrations/cli.ts` | `lib/database/migrations/cli.ts` |

**Scripts updated in package.json:**

```json
{
  "scripts": {
    "migrate:up": "tsx lib/database/migrations/cli.ts up",
    "migrate:down": "tsx lib/database/migrations/cli.ts down",
    "migrate:status": "tsx lib/database/migrations/cli.ts status"
  }
}
```

## React 19.2 Changes

### 1. Server Actions Replace API Calls

**Before (API Route + fetch):**

```typescript
// Client component
async function handleSubmit(e) {
  e.preventDefault();
  const response = await fetch('/api/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

**After (Server Action):**

```typescript
// actions/account.actions.ts
'use server';

export async function createAccountAction(formData: FormData) {
  const name = formData.get('name');
  // Create account logic
}

// Client component
<form action={createAccountAction}>
  <input name="name" />
  <button type="submit">Create</button>
</form>
```

### 2. use Hook for Data Fetching

**Before (useEffect + useState):**

```typescript
function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => {
        setAccounts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render accounts */}</div>;
}
```

**After (use hook):**

```typescript
'use client';
import { use } from 'react';

function AccountList({ accountsPromise }) {
  const accounts = use(accountsPromise);
  return <div>{/* render accounts */}</div>;
}

// Parent component
export default function AccountsPage() {
  const accountsPromise = fetch('/api/accounts').then(r => r.json());

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountList accountsPromise={accountsPromise} />
    </Suspense>
  );
}
```

### 3. useOptimistic for Instant Updates

**Before (Manual optimistic updates):**

```typescript
async function deleteAccount(id) {
  // Optimistically remove from UI
  setAccounts((prev) => prev.filter((a) => a.id !== id));

  try {
    await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
  } catch (error) {
    // Manually revert on error
    fetchAccounts();
  }
}
```

**After (useOptimistic):**

```typescript
const [optimisticAccounts, deleteOptimistic] = useOptimistic(accounts, (state, deletedId) =>
  state.filter((a) => a.id !== deletedId),
);

async function deleteAccount(id) {
  deleteOptimistic(id); // Automatic rollback on error
  await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
}
```

### 4. useFormStatus for Loading States

**Before (Manual loading state):**

```typescript
function SubmitButton({ loading }) {
  return (
    <button disabled={loading}>
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    setLoading(true);
    await submitForm();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton loading={loading} />
    </form>
  );
}
```

**After (useFormStatus):**

```typescript
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form() {
  return (
    <form action={submitAction}>
      <SubmitButton />
    </form>
  );
}
```

### 5. useActionState for Action State Management

**Before (Manual state management):**

```typescript
function LoginForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
}
```

**After (useActionState):**

```typescript
'use client';
import { useActionState } from 'react';

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null
  });

  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}
      <button disabled={isPending}>Login</button>
    </form>
  );
}
```

## Code Location Mapping

### Quick Reference

| Component Type    | Old Location                        | New Location                  |
| ----------------- | ----------------------------------- | ----------------------------- |
| Pages/Screens     | `apps/web/src/screens/`             | `app/(auth)/` or `app/(app)/` |
| UI Components     | `apps/web/src/components/ui/`       | `components/ui/`              |
| Layout Components | `apps/web/src/components/layout/`   | `components/layout/`          |
| Custom Hooks      | `apps/web/src/hooks/`               | `hooks/`                      |
| API Endpoints     | `apps/api/src/*/controllers/`       | `app/api/`                    |
| Services          | `apps/api/src/*/services/`          | `lib/services/`               |
| Auth Logic        | `apps/api/src/auth/`                | `lib/auth/`                   |
| Database          | `apps/api/src/database/`            | `lib/database/`               |
| Migrations        | `apps/api/src/database/migrations/` | `lib/database/migrations/`    |
| Types             | `apps/web/src/types.ts`             | `lib/types/index.ts`          |
| Utils             | `apps/api/src/utils/`               | `lib/utils/`                  |
| Appwrite          | `apps/api/src/appwrite/`            | `lib/appwrite/`               |

### Finding Migrated Code

**To find where a file was migrated:**

1. Check the mapping table above
2. Look for similar file names in the new location
3. Search by function/component name: `grep -r "functionName" .`

**Example:**

- Looking for `LoginScreen`? → Check `app/(auth)/login/page.tsx`
- Looking for `AuthService`? → Check `lib/services/auth.service.ts`
- Looking for `useAccounts`? → Check `hooks/useAccounts.ts`

## Troubleshooting

### Common Issues

#### 1. Import Errors

**Problem:** `Cannot find module '@/components/ui/Button'`

**Solution:** Ensure TypeScript paths are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### 2. Authentication Not Working

**Problem:** User is not authenticated after login

**Solution:** Check that:

- Cookie is being set with correct options (httpOnly, secure, sameSite)
- Middleware is configured correctly
- `credentials: 'include'` is used in fetch calls

#### 3. Server Actions Not Working

**Problem:** `Error: Functions cannot be passed directly to Client Components`

**Solution:** Ensure Server Actions are in files marked with `'use server'`:

```typescript
'use server';

export async function myAction() {
  // Action code
}
```

#### 4. Hydration Errors

**Problem:** `Hydration failed because the initial UI does not match`

**Solution:**

- Ensure Server and Client Components render the same initial HTML
- Don't use browser-only APIs (localStorage, window) during initial render
- Use `useEffect` for client-only code

#### 5. Environment Variables Not Available

**Problem:** `process.env.MY_VAR is undefined`

**Solution:**

- Client-side variables must use `NEXT_PUBLIC_` prefix
- Server-side variables work without prefix
- Restart dev server after changing `.env.local`

### Migration Checklist

If you're migrating additional code, follow this checklist:

- [ ] Update import paths to use `@/` alias
- [ ] Convert React Router routes to App Router pages
- [ ] Update API calls to use new endpoints
- [ ] Replace localStorage auth with cookies
- [ ] Update environment variable names
- [ ] Add `'use client'` to interactive components
- [ ] Add `'use server'` to Server Actions
- [ ] Update hooks to use React 19.2 features where appropriate
- [ ] Test authentication flow
- [ ] Test all CRUD operations
- [ ] Verify protected routes work correctly

## Next Steps

After understanding the migration:

1. Read the [Development Guide](DEVELOPMENT-GUIDE.md) to learn how to add new features
2. Review the [README](../README.md) for setup instructions
3. Check the [Appwrite Setup Guide](APPWRITE-QUICKSTART.md) for database configuration
4. Explore the codebase to see migration patterns in action

## Questions?

If you have questions about the migration:

1. Check this guide first
2. Review the [Development Guide](DEVELOPMENT-GUIDE.md)
3. Look at existing code for patterns
4. Open an issue on GitHub

---

**Migration completed:** October 2025  
**Next.js version:** 16.0.0  
**React version:** 19.2.0
