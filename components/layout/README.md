# Layout Components

This directory contains the layout components for the Horizon AI application, migrated from the Turborepo structure to Next.js 16.

## Components

### DashboardLayout

The main layout component that wraps all protected pages in the application. It includes the sidebar navigation and handles user authentication state.

**Props:**

- `children: React.ReactNode` - The page content to render
- `user: User` - The authenticated user object

**Features:**

- Full sidebar navigation with all app sections
- Active route highlighting using Next.js `usePathname`
- Logout functionality with confirmation modal
- Responsive design
- Client-side navigation using Next.js `Link` and `useRouter`

**Usage:**

```tsx
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProtectedPage({ user }) {
  return (
    <DashboardLayout user={user}>
      <div>Your page content here</div>
    </DashboardLayout>
  );
}
```

### Sidebar

A standalone sidebar component that can be used independently of the full DashboardLayout.

**Props:**

- `user: User` - The authenticated user object

**Features:**

- Navigation menu with sections (Main, Intelligence, Wealth Management, Ecosystem)
- User profile display
- Logout functionality
- Active route highlighting

**Usage:**

```tsx
import { Sidebar } from '@/components/layout';

export default function CustomLayout({ user, children }) {
  return (
    <div className="flex">
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  );
}
```

### Header

A header component with search, notifications, and user avatar.

**Props:**

- `user: User` - The authenticated user object
- `title?: string` - Optional page title to display

**Features:**

- Search button
- Notifications bell with indicator
- User avatar
- Optional page title

**Usage:**

```tsx
import { Header } from '@/components/layout';

export default function Page({ user }) {
  return (
    <>
      <Header user={user} title="Dashboard Overview" />
      <div>Page content</div>
    </>
  );
}
```

### Footer

A simple footer component with copyright and links.

**Features:**

- Copyright notice with current year
- Links to Privacy Policy, Terms of Service, and Help Center
- Responsive layout

**Usage:**

```tsx
import { Footer } from '@/components/layout';

export default function Page() {
  return (
    <>
      <div>Page content</div>
      <Footer />
    </>
  );
}
```

## Migration Notes

### Changes from Original Implementation

1. **Navigation System**: Changed from callback-based navigation (`onNavigate`) to Next.js Link components and `useRouter`
2. **Active State**: Uses `usePathname()` hook instead of `activeScreen` prop
3. **Client Component**: All layout components are marked with `'use client'` directive
4. **User Type**: Updated to use the migrated `User` type from `@/lib/types`
5. **Logout Flow**: Integrated with Next.js API routes (`/api/auth/sign-out`)
6. **Import Paths**: Updated to use Next.js path aliases (`@/components`, `@/lib`)

### Route Mapping

The navigation items map to the following Next.js routes:

| Label           | Route             |
| --------------- | ----------------- |
| Overview        | `/overview`       |
| Accounts        | `/accounts`       |
| Transactions    | `/transactions`   |
| Categories      | `/categories`     |
| Shopping Lists  | `/shopping-list`  |
| Invoices        | `/invoices`       |
| Warranties      | `/warranties`     |
| Taxes (IRPF)    | `/taxes`          |
| Financial Goals | `/planning-goals` |
| Succession      | `/succession`     |
| Insurance       | `/insurance`      |
| Integrations    | `/integrations`   |
| Settings        | `/settings`       |
| Help & Support  | `/help`           |

## Dependencies

- `next/link` - For client-side navigation
- `next/navigation` - For `usePathname` and `useRouter` hooks
- `@/components/assets/Icons` - Icon components
- `@/components/ui/Modal` - Modal component for logout confirmation
- `@/lib/types` - TypeScript type definitions

## Styling

All components use Tailwind CSS with Material Design 3 color tokens:

- `bg-surface` - Surface background
- `text-on-surface` - Primary text color
- `text-on-surface-variant` - Secondary text color
- `bg-primary-container` - Active state background
- `text-primary` - Primary brand color
- `border-outline` - Border color

## Best Practices

1. Always pass the authenticated user object to layout components
2. Use the DashboardLayout for all protected pages
3. The layout handles logout functionality - no need to implement it in individual pages
4. Active route highlighting is automatic based on the current pathname
5. All navigation is client-side for optimal performance
