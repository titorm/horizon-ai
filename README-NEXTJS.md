# Horizon AI - Next.js 16 Migration

This project has been migrated from a Turborepo monorepo to a Next.js 16 monolithic application.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19.2** with Server Components and Actions
- **TypeScript 5.9**
- **Tailwind CSS 3.4**
- **Appwrite** for backend services
- **React Compiler** (experimental) for automatic optimization
- **Partial Prerendering (PPR)** for hybrid rendering

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 9

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This will start the development server with Turbopack at [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## Project Structure

```
horizon-ai/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Public routes (login, register)
│   ├── (app)/             # Protected routes (dashboard, etc.)
│   ├── api/               # API Routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── modals/           # Modal components
│   └── assets/           # Icons and logos
├── lib/                  # Utilities and configurations
│   ├── appwrite/         # Appwrite client
│   ├── auth/             # Authentication utilities
│   ├── services/         # Business logic
│   ├── database/         # Database utilities and migrations
│   ├── utils/            # General utilities
│   └── types/            # TypeScript types
├── hooks/                # Custom React hooks
├── actions/              # Server Actions
└── public/               # Static assets
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```env
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=
JWT_SECRET=
JWT_EXPIRATION=7d
```

## Database Migrations

```bash
# Run migrations
pnpm migrate:up

# Rollback migrations
pnpm migrate:down

# Check migration status
pnpm migrate:status
```

## Features

### React 19.2 Features

- **Server Actions**: Direct server-side function calls from components
- **use Hook**: Consume Promises and Context
- **useOptimistic**: Optimistic UI updates
- **useFormStatus**: Form submission state
- **useActionState**: Server Action state management

### Next.js 16 Features

- **Turbopack**: Fast bundler (stable)
- **React Compiler**: Automatic optimization (experimental)
- **Partial Prerendering (PPR)**: Hybrid static/dynamic rendering
- **Enhanced Caching**: Improved cache control
- **Async Request APIs**: `await cookies()`, `await headers()`

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm migrate:up` - Run database migrations
- `pnpm migrate:down` - Rollback database migrations
- `pnpm migrate:status` - Check migration status

## License

MIT
