# Development Guide

This guide covers how to develop new features and extend the Horizon AI application using Next.js 16 and React 19.2.

## Table of Contents

- [Getting Started](#getting-started)
- [Adding New Routes](#adding-new-routes)
- [Creating API Endpoints](#creating-api-endpoints)
- [Server Actions](#server-actions)
- [React 19.2 Patterns](#react-192-patterns)
- [React Compiler Guidelines](#react-compiler-guidelines)
- [Database Operations](#database-operations)
- [Best Practices](#best-practices)

## Getting Started

### Development Environment

1. **Start the development server:**

```bash
pnpm dev
```

This starts Next.js with Turbopack for fast hot module replacement.

2. **Type checking:**

```bash
pnpm typecheck
```

3. **Linting:**

```bash
pnpm lint
```

### Project Structure Overview

```
horizon-ai/
├── app/                    # Routes and API endpoints
├── components/             # Reusable React components
├── lib/                    # Business logic and utilities
├── hooks/                  # Custom React hooks
├── actions/                # Server Actions
└── middleware.ts           # Route protection
```

## Adding New Routes

### Public Routes

Public routes are accessible without authentication.

**1. Create the page file:**

```typescript
// app/(auth)/forgot-password/page.tsx
export default function ForgotPasswordPage() {
  return (
    <div>
      <h1>Forgot Password</h1>
      {/* Your component code */}
    </div>
  );
}
```

**2. Update middleware (if needed):**

```typescript
// middleware.ts
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/pricing',
  '/forgot-password', // Add new public route
];
```

### Protected Routes

Protected routes require authentication and use the dashboard layout.

**1. Create the page file:**

```typescript
// app/(app)/reports/page.tsx
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Reports</h1>
      <p>Welcome, {user.name}</p>
      {/* Your component code */}
    </div>
  );
}
```

**2. Add navigation link:**

```typescript
// components/layout/Sidebar.tsx
const menuItems = [
  // ... existing items
  {
    name: 'Reports',
    href: '/reports',
    icon: ChartBarIcon,
  },
];
```

### Routes with Partial Prerendering (PPR)

PPR allows mixing static and dynamic content in the same route.

**Enable PPR for a route:**

```typescript
// app/(app)/dashboard/page.tsx
import { Suspense } from 'react';

// Enable PPR for this route
export const experimental_ppr = true;

export default function DashboardPage() {
  return (
    <div>
      {/* Static content - rendered at build time */}
      <header>
        <h1>Dashboard</h1>
      </header>

      {/* Dynamic content - rendered on request */}
      <Suspense fallback={<LoadingSkeleton />}>
        <DynamicAccountList />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <DynamicTransactionList />
      </Suspense>
    </div>
  );
}

// This component fetches data dynamically
async function DynamicAccountList() {
  const accounts = await fetchAccounts();
  return <AccountList accounts={accounts} />;
}
```

**Benefits of PPR:**

- Fast initial page load (static shell)
- Dynamic data without full page reload
- Better SEO and performance

### Dynamic Routes

Create dynamic routes using folder names with brackets.

**Example: Account details page**

```typescript
// app/(app)/accounts/[id]/page.tsx
import { getAccountById } from '@/lib/services/account.service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountDetailPage({ params }: PageProps) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account) {
    notFound();
  }

  return (
    <div>
      <h1>{account.name}</h1>
      <p>Balance: ${account.balance}</p>
      {/* More details */}
    </div>
  );
}
```

## Creating API Endpoints

### Basic API Route

API Routes are created in the `app/api` directory.

**Example: GET endpoint**

```typescript
// app/api/reports/route.ts
import { getCurrentUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Authenticate user
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch data
  const reports = await getReportsByUserId(user.id);

  // Return response
  return NextResponse.json(reports);
}
```

**Example: POST endpoint**

```typescript
// app/api/reports/route.ts
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse request body
  const body = await request.json();
  const { title, type, dateRange } = body;

  // Validate input
  if (!title || !type) {
    return NextResponse.json({ error: 'Title and type are required' }, { status: 400 });
  }

  // Create report
  const report = await createReport({
    userId: user.id,
    title,
    type,
    dateRange,
  });

  return NextResponse.json(report, { status: 201 });
}
```

### Dynamic API Routes

**Example: Resource by ID**

```typescript
// app/api/reports/[id]/route.ts
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Check ownership
  if (report.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(report);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const updatedReport = await updateReport(id, body);
  return NextResponse.json(updatedReport);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await deleteReport(id);

  return NextResponse.json({ success: true });
}
```

### API Route Configuration

Configure caching and revalidation:

```typescript
// app/api/reports/route.ts

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';

// Or set revalidation period
export const revalidate = 60; // Revalidate every 60 seconds

// Control fetch cache
export const fetchCache = 'force-cache';

export async function GET() {
  // Your endpoint logic
}
```

## Server Actions

Server Actions are functions that run on the server and can be called directly from Client Components.

### Creating Server Actions

**1. Create an action file:**

```typescript
// actions/report.actions.ts
'use server';

import { getCurrentUser } from '@/lib/auth/session';
import { createReport, deleteReport } from '@/lib/services/report.service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// actions/report.actions.ts

export async function createReportAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const type = formData.get('type') as string;

  // Validate
  if (!title || !type) {
    return { success: false, error: 'Title and type are required' };
  }

  try {
    const report = await createReport({
      userId: user.id,
      title,
      type,
    });

    // Revalidate the reports page
    revalidatePath('/reports');

    return { success: true, report };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteReportAction(reportId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await deleteReport(reportId);
    revalidatePath('/reports');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Using Server Actions in Components

**With form action:**

```typescript
'use client';

import { createReportAction } from '@/actions/report.actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Report'}
    </button>
  );
}

export function CreateReportForm() {
  const [state, formAction] = useActionState(createReportAction, null);

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="error">{state.error}</div>
      )}

      <input
        name="title"
        placeholder="Report title"
        required
      />

      <select name="type" required>
        <option value="">Select type</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <SubmitButton />
    </form>
  );
}
```

**Programmatic call:**

```typescript
'use client';

import { deleteReportAction } from '@/actions/report.actions';
import { useTransition } from 'react';

export function DeleteReportButton({ reportId }: { reportId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm('Are you sure?')) return;

    startTransition(async () => {
      const result = await deleteReportAction(reportId);

      if (!result.success) {
        alert(result.error);
      }
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

## React 19.2 Patterns

### 1. use Hook for Data Fetching

The `use` hook allows you to consume Promises in components.

```typescript
'use client';

import { use, Suspense } from 'react';

interface ReportListProps {
  reportsPromise: Promise<Report[]>;
}

function ReportList({ reportsPromise }: ReportListProps) {
  // use hook unwraps the Promise
  const reports = use(reportsPromise);

  return (
    <ul>
      {reports.map(report => (
        <li key={report.id}>{report.title}</li>
      ))}
    </ul>
  );
}

export default function ReportsPage() {
  // Create Promise (doesn't block rendering)
  const reportsPromise = fetch('/api/reports').then(r => r.json());

  return (
    <div>
      <h1>Reports</h1>
      <Suspense fallback={<div>Loading reports...</div>}>
        <ReportList reportsPromise={reportsPromise} />
      </Suspense>
    </div>
  );
}
```

### 2. useOptimistic for Instant Updates

Provide instant feedback while waiting for server confirmation.

```typescript
'use client';

import { useOptimistic, useTransition } from 'react';
import { deleteReportAction } from '@/actions/report.actions';

interface Report {
  id: string;
  title: string;
}

export function ReportList({ initialReports }: { initialReports: Report[] }) {
  const [isPending, startTransition] = useTransition();

  // useOptimistic manages optimistic state
  const [optimisticReports, deleteOptimistic] = useOptimistic(
    initialReports,
    (state, deletedId: string) => state.filter(r => r.id !== deletedId)
  );

  function handleDelete(reportId: string) {
    startTransition(async () => {
      // Optimistically remove from UI
      deleteOptimistic(reportId);

      // Call server action
      const result = await deleteReportAction(reportId);

      // If error, useOptimistic automatically reverts
      if (!result.success) {
        alert(result.error);
      }
    });
  }

  return (
    <ul>
      {optimisticReports.map(report => (
        <li key={report.id}>
          {report.title}
          <button onClick={() => handleDelete(report.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### 3. useFormStatus for Form State

Access form submission state in child components.

```typescript
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending, data, method } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={pending ? 'opacity-50' : ''}
    >
      {pending ? 'Submitting...' : children}
    </button>
  );
}

// Usage in form
export function MyForm() {
  return (
    <form action={myAction}>
      <input name="title" />
      <SubmitButton>Create</SubmitButton>
    </form>
  );
}
```

### 4. useActionState for Action State Management

Manage state returned from Server Actions.

```typescript
'use client';

import { useActionState } from 'react';
import { createReportAction } from '@/actions/report.actions';

export function CreateReportForm() {
  const [state, formAction, isPending] = useActionState(
    createReportAction,
    { success: false, error: null, report: null }
  );

  return (
    <form action={formAction}>
      {state.error && (
        <div className="error">{state.error}</div>
      )}

      {state.success && (
        <div className="success">
          Report created: {state.report?.title}
        </div>
      )}

      <input name="title" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## React Compiler Guidelines

Next.js 16 includes the experimental React Compiler, which automatically optimizes your components.

### What the Compiler Does

- Automatically memoizes components and values
- Eliminates need for `useMemo` and `useCallback` in most cases
- Optimizes re-renders without manual intervention

### Writing Compiler-Friendly Code

**Good - Compiler can optimize:**

```typescript
function ReportCard({ report }) {
  // No need for useMemo - compiler handles it
  const formattedDate = formatDate(report.createdAt);

  // No need for useCallback - compiler handles it
  const handleClick = () => {
    console.log(report.id);
  };

  return (
    <div onClick={handleClick}>
      <h3>{report.title}</h3>
      <p>{formattedDate}</p>
    </div>
  );
}
```

### When to Still Use useMemo/useCallback

Only use manual memoization for:

1. **Expensive computations**
2. **Referential equality requirements**
3. **Third-party library requirements**

## Database Operations

### Creating a New Service

```typescript
// lib/services/report.service.ts
import { AppwriteClient } from '@/lib/appwrite/client';
import { Databases, ID, Query } from 'node-appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const REPORTS_COLLECTION_ID = 'reports';

export async function createReport(data: { userId: string; title: string; type: string }) {
  const client = AppwriteClient.getInstance();
  const databases = new Databases(client);

  const report = await databases.createDocument(DATABASE_ID, REPORTS_COLLECTION_ID, ID.unique(), {
    userId: data.userId,
    title: data.title,
    type: data.type,
    createdAt: new Date().toISOString(),
  });

  return report;
}

export async function getReportsByUserId(userId: string) {
  const client = AppwriteClient.getInstance();
  const databases = new Databases(client);

  const response = await databases.listDocuments(DATABASE_ID, REPORTS_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.orderDesc('createdAt'),
  ]);

  return response.documents;
}
```

### Creating a Migration

```typescript
// lib/database/migrations/20251024_000001_create_reports_table.ts
import { AppwriteClient } from '@/lib/appwrite/client';
import { Databases } from 'node-appwrite';

import { Migration } from './migration.interface';

export const migration: Migration = {
  id: '20251024_000001_create_reports_table',
  name: 'Create reports table',

  async up() {
    const client = AppwriteClient.getInstance();
    const databases = new Databases(client);
    const databaseId = process.env.APPWRITE_DATABASE_ID!;

    // Create collection
    await databases.createCollection(databaseId, 'reports', 'reports', ['read("user:self")', 'write("user:self")']);

    // Create attributes
    await databases.createStringAttribute(databaseId, 'reports', 'userId', 255, true);

    console.log('Reports table created');
  },

  async down() {
    const client = AppwriteClient.getInstance();
    const databases = new Databases(client);
    const databaseId = process.env.APPWRITE_DATABASE_ID!;

    await databases.deleteCollection(databaseId, 'reports');
    console.log('Reports table deleted');
  },
};
```

**Run the migration:**

```bash
pnpm migrate:up
```

## Best Practices

### 1. Component Organization

Separate concerns into focused components.

### 2. Error Handling

Always handle errors comprehensively in Server Actions and API Routes.

### 3. Type Safety

Use TypeScript interfaces for all data structures.

### 4. Loading States

Provide proper loading states with Suspense boundaries.

### 5. Revalidation

Revalidate paths after mutations using `revalidatePath()`.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Migration Guide](MIGRATION-GUIDE.md)
- [README](../README.md)

---

Happy coding!
