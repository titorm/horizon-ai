# Design Document

## Overview

Esta migração transformará o projeto Horizon AI de uma arquitetura Turborepo (monorepo com apps/web e apps/api separados) para um monolito Next.js 16 moderno. A aplicação resultante utilizará o App Router do Next.js, Server Components, Server Actions, API Routes e as novas features do React 19.2 para consolidar frontend e backend em uma única aplicação coesa e otimizada.

### Objetivos Principais

1. **Simplificação**: Eliminar complexidade do monorepo e reduzir overhead de configuração
2. **Performance**: Aproveitar Server Components, React Compiler e otimizações do Next.js 16
3. **Developer Experience**: Melhorar DX com hot reload unificado, Turbopack e estrutura mais simples
4. **Modern Features**: Utilizar React 19.2 features (use hook, Actions, useOptimistic, useFormStatus)
5. **Deploy**: Facilitar deploy na Vercel com configuração otimizada
6. **Manutenibilidade**: Código mais coeso e fácil de navegar

### Tecnologias

- **Next.js 16**: Framework React com App Router e Turbopack
- **React 19.2**: Biblioteca UI com Server Components, Actions e novos hooks
- **TypeScript 5.9**: Type safety
- **Appwrite**: Backend-as-a-Service (banco de dados, autenticação)
- **Tailwind CSS**: Styling (implícito nos componentes existentes)
- **React Compiler**: Otimização automática de performance (experimental)

## Architecture

### Estrutura de Diretórios Proposta

```
horizon-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group para páginas públicas
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Layout para auth pages
│   │
│   ├── (app)/                    # Route group para páginas protegidas
│   │   ├── overview/
│   │   │   └── page.tsx
│   │   ├── accounts/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── credit/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   └── page.tsx
│   │   ├── taxes/
│   │   │   └── page.tsx
│   │   ├── warranties/
│   │   │   └── page.tsx
│   │   ├── planning-goals/
│   │   │   └── page.tsx
│   │   ├── shopping-list/
│   │   │   └── page.tsx
│   │   ├── succession/
│   │   │   └── page.tsx
│   │   ├── insurance/
│   │   │   └── page.tsx
│   │   ├── retirement/
│   │   │   └── page.tsx
│   │   ├── family/
│   │   │   └── page.tsx
│   │   ├── compliance/
│   │   │   └── page.tsx
│   │   ├── integrations/
│   │   │   └── page.tsx
│   │   ├── marketplace/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── help/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # DashboardLayout wrapper
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── sign-in/
│   │   │   │   └── route.ts
│   │   │   ├── sign-up/
│   │   │   │   └── route.ts
│   │   │   ├── sign-out/
│   │   │   │   └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   ├── users/
│   │   │   └── profile/
│   │   │       └── route.ts
│   │   ├── accounts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── credit-cards/
│   │   │   ├── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── account/
│   │   │       └── [accountId]/
│   │   │           └── route.ts
│   │   └── transactions/
│   │       ├── route.ts
│   │       ├── manual/
│   │       │   └── route.ts
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       └── stats/
│   │           └── [userId]/
│   │               └── route.ts
│   │
│   ├── pricing/
│   │   └── page.tsx              # Página pública de pricing
│   ├── page.tsx                  # Landing page (/)
│   ├── layout.tsx                # Root layout
│   └── middleware.ts             # Auth middleware
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes UI reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   ├── Stepper.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   └── DropdownMenu.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── modals/                   # Modais específicos
│   │   ├── AddAccountModal.tsx
│   │   └── AddCreditCardModal.tsx
│   ├── transactions/             # Componentes de transações
│   │   └── TransactionComponents.tsx
│   └── assets/                   # Assets como ícones
│       ├── BankLogos.tsx
│       └── Icons.tsx
│
├── lib/                          # Utilitários e configurações
│   ├── appwrite/                 # Cliente Appwrite
│   │   ├── client.ts
│   │   ├── database.ts
│   │   └── schema.ts
│   ├── auth/                     # Lógica de autenticação
│   │   ├── session.ts
│   │   ├── jwt.ts
│   │   └── middleware.ts
│   ├── services/                 # Business logic (ex-NestJS services)
│   │   ├── user.service.ts
│   │   ├── account.service.ts
│   │   ├── credit-card.service.ts
│   │   └── transaction.service.ts
│   ├── database/                 # Database utilities
│   │   ├── migrations/
│   │   │   ├── cli.ts
│   │   │   ├── runner.ts
│   │   │   ├── interface.ts
│   │   │   ├── applied-migrations.json
│   │   │   └── [migration-files].ts
│   │   └── adapter.ts
│   ├── utils/                    # Utilitários gerais
│   │   └── random-name.generator.ts
│   └── types/                    # Type definitions
│       └── index.ts
│
├── hooks/                        # Custom React hooks
│   ├── useAccounts.ts
│   ├── useCreditCards.ts
│   ├── useTransactions.ts
│   ├── useFinancialInsights.ts
│   └── useTotalBalance.ts
│
├── actions/                      # Server Actions
│   ├── auth.actions.ts
│   ├── account.actions.ts
│   ├── transaction.actions.ts
│   └── user.actions.ts
│
├── public/                       # Static assets
│   └── assets/
│
├── .env.local                    # Environment variables
├── .env.example                  # Example env file
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind configuration
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

### Mapeamento de Rotas

| Screen Atual | Rota Next.js | Tipo |
|-------------|--------------|------|
| LandingScreen | `/` | Público |
| LoginScreen | `/login` | Público |
| RegisterScreen | `/register` | Público |
| PricingScreen | `/pricing` | Público |
| DashboardOverviewScreen | `/overview` | Protegido |
| AccountsScreen | `/accounts` | Protegido |
| TransactionsScreen | `/transactions` | Protegido |
| CategoriesScreen | `/categories` | Protegido |
| AnalyticsScreen | `/analytics` | Protegido |
| CreditScreen | `/credit` | Protegido |
| InvoicesScreen | `/invoices` | Protegido |
| TaxScreen | `/taxes` | Protegido |
| WarrantiesScreen | `/warranties` | Protegido |
| PlanningGoalsScreen | `/planning-goals` | Protegido |
| ShoppingListScreen | `/shopping-list` | Protegido |
| SuccessionScreen | `/succession` | Protegido |
| InsuranceScreen | `/insurance` | Protegido |
| RetirementScreen | `/retirement` | Protegido |
| FamilyScreen | `/family` | Protegido |
| ComplianceScreen | `/compliance` | Protegido |
| IntegrationsScreen | `/integrations` | Protegido |
| MarketplaceScreen | `/marketplace` | Protegido |
| NotificationsScreen | `/notifications` | Protegido |
| SettingsScreen | `/settings` | Protegido |
| HelpScreen | `/help` | Protegido |

**Screens Removidos** (onboarding temporariamente em standby):
- WelcomeScreen
- BankSelectionScreen
- SecurityInterstitialScreen
- LoadingScreen

## Components and Interfaces

### 1. Middleware de Autenticação

**Arquivo**: `app/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas
  const publicPaths = ['/', '/login', '/register', '/pricing'];
  const isPublicPath = publicPaths.some(path => pathname === path);

  // Rotas protegidas (todas exceto as públicas e /api)
  const isProtectedPath = !isPublicPath && !pathname.startsWith('/api');

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      await verifyJWT(token);
      
      // Se autenticado e tentando acessar página pública, redirecionar para overview
      if (isPublicPath && pathname !== '/pricing') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }
    } catch (error) {
      // Token inválido
      if (isProtectedPath) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 2. Layouts

#### Root Layout

**Arquivo**: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Horizon AI - Financial Management Platform',
  description: 'Comprehensive financial management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

#### App Layout (Protected Routes)

**Arquivo**: `app/(app)/layout.tsx`

```typescript
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  );
}
```

### 3. API Routes

#### Estrutura de API Route

**Exemplo**: `app/api/auth/sign-in/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/services/auth.service';
import { generateJWT } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validação
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Autenticar usuário
    const user = await signIn(email, password);

    // Gerar JWT
    const token = await generateJWT({ userId: user.id, email: user.email });

    // Criar response com cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}
```

### 4. Server Actions (React 19.2)

**Arquivo**: `actions/auth.actions.ts`

```typescript
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signIn, signUp } from '@/lib/services/auth.service';
import { generateJWT } from '@/lib/auth/jwt';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await signIn(email, password);
    const token = await generateJWT({ userId: user.id, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}
```

**Exemplo de uso com React 19.2 hooks**:

```typescript
'use client';

import { useActionState } from 'react';
import { loginAction } from '@/actions/auth.actions';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### 5. Services (Migração de NestJS)

**Arquivo**: `lib/services/auth.service.ts`

```typescript
import { AppwriteClient } from '@/lib/appwrite/client';
import { Account, ID } from 'node-appwrite';

export async function signIn(email: string, password: string) {
  const client = AppwriteClient.getInstance();
  const account = new Account(client);

  try {
    // Criar sessão no Appwrite
    const session = await account.createEmailPasswordSession(email, password);
    
    // Buscar dados do usuário
    const user = await account.get();

    return {
      id: user.$id,
      email: user.email,
      firstName: user.name,
    };
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName?: string
) {
  const client = AppwriteClient.getInstance();
  const account = new Account(client);

  try {
    const user = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName}${lastName ? ' ' + lastName : ''}`
    );

    return {
      id: user.$id,
      email: user.email,
      firstName,
      lastName,
    };
  } catch (error) {
    throw new Error('Registration failed');
  }
}
```

### 6. Appwrite Client

**Arquivo**: `lib/appwrite/client.ts`

```typescript
import { Client } from 'node-appwrite';

export class AppwriteClient {
  private static instance: Client;

  static getInstance(): Client {
    if (!AppwriteClient.instance) {
      AppwriteClient.instance = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_API_KEY!);
    }

    return AppwriteClient.instance;
  }
}
```

### 7. Custom Hooks com React 19.2 Features

**Arquivo**: `hooks/useAccounts.ts`

```typescript
'use client';

import { use, useState, useOptimistic } from 'react';

// Usando o novo hook 'use' do React 19.2 para data fetching
export function useAccounts() {
  const accountsPromise = fetch('/api/accounts', {
    credentials: 'include',
  }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch accounts');
    return res.json();
  });

  const accounts = use(accountsPromise);
  return accounts;
}

// Exemplo com useOptimistic para updates otimistas
export function useAccountsWithOptimistic(initialAccounts) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [optimisticAccounts, addOptimisticAccount] = useOptimistic(
    accounts,
    (state, newAccount) => [...state, newAccount]
  );

  async function createAccount(accountData) {
    // Adiciona otimisticamente
    addOptimisticAccount(accountData);
    
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
        credentials: 'include',
      });
      
      const newAccount = await response.json();
      setAccounts(prev => [...prev, newAccount]);
    } catch (error) {
      // Rollback automático pelo useOptimistic
      console.error('Failed to create account:', error);
    }
  }

  return { accounts: optimisticAccounts, createAccount };
}
```

**Exemplo com useFormStatus**:

```typescript
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Account'}
    </button>
  );
}
```

## Data Models

### User Type

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  createdAt?: string;
}
```

### Account Type

```typescript
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT';
  balance: number;
  currency: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Transaction Type

```typescript
export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  date: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

## Error Handling

### API Error Response

```typescript
export interface APIError {
  message: string;
  code?: string;
  statusCode: number;
}
```

### Error Handler Utility

```typescript
export function handleAPIError(error: any): APIError {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      code: error.response.data.code,
      statusCode: error.response.status,
    };
  }
  
  return {
    message: error.message || 'Network error',
    statusCode: 500,
  };
}
```

## Testing Strategy

### 1. Unit Tests

- Testar services isoladamente
- Testar utilitários (JWT, validações)
- Testar componentes UI com React Testing Library

### 2. Integration Tests

- Testar API Routes com requisições HTTP
- Testar fluxos de autenticação completos
- Testar integração com Appwrite

### 3. E2E Tests (Opcional)

- Testar fluxos críticos (login, criação de conta, transações)
- Usar Playwright ou Cypress

### Testing Tools

- **Jest**: Unit tests
- **React Testing Library**: Component tests
- **MSW (Mock Service Worker)**: API mocking
- **Playwright**: E2E tests (opcional)

## React 19.2 New Features Integration

### 1. Actions (Form Actions)

React 19.2 introduz Actions nativas que funcionam perfeitamente com Server Actions do Next.js:

```typescript
'use client';

export function CreateAccountForm() {
  async function createAccount(formData: FormData) {
    'use server';
    
    const name = formData.get('name');
    const type = formData.get('type');
    
    // Lógica de criação
    await saveAccount({ name, type });
  }

  return (
    <form action={createAccount}>
      <input name="name" required />
      <select name="type">
        <option value="CHECKING">Checking</option>
        <option value="SAVINGS">Savings</option>
      </select>
      <button type="submit">Create</button>
    </form>
  );
}
```

### 2. use Hook

O novo hook `use` permite consumir Promises e Context de forma mais simples:

```typescript
'use client';

import { use } from 'react';

function AccountDetails({ accountPromise }) {
  const account = use(accountPromise);
  
  return <div>{account.name}: ${account.balance}</div>;
}
```

### 3. useOptimistic

Para updates otimistas na UI antes da confirmação do servidor:

```typescript
'use client';

import { useOptimistic } from 'react';

function TransactionList({ transactions }) {
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    transactions,
    (state, newTransaction) => [...state, { ...newTransaction, pending: true }]
  );

  async function addTransaction(formData) {
    const transaction = { id: Date.now(), ...Object.fromEntries(formData) };
    addOptimisticTransaction(transaction);
    await saveTransaction(transaction);
  }

  return (
    <form action={addTransaction}>
      {/* form fields */}
    </form>
  );
}
```

### 4. useFormStatus

Para acessar o status de formulários em componentes filhos:

```typescript
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### 5. useActionState (novo nome para useFormState)

Para gerenciar estado de Server Actions:

```typescript
'use client';

import { useActionState } from 'react';

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction}>
      {state.error && <p className="error">{state.error}</p>}
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={isPending}>Login</button>
    </form>
  );
}
```

## Next.js 16 New Features

### 1. Turbopack (Stable)

Next.js 16 torna o Turbopack estável por padrão, oferecendo builds até 10x mais rápidos:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack é padrão no Next.js 16
  experimental: {
    turbo: {
      // Configurações adicionais se necessário
    },
  },
};
```

### 2. React Compiler (Experimental)

Otimização automática sem necessidade de useMemo/useCallback:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};
```

### 3. Partial Prerendering (PPR)

Combina static e dynamic rendering na mesma rota:

```typescript
// app/(app)/overview/page.tsx
export const experimental_ppr = true;

export default async function OverviewPage() {
  return (
    <div>
      <StaticHeader />
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />
      </Suspense>
    </div>
  );
}
```

### 4. Enhanced Caching

Melhorias no sistema de cache com mais controle:

```typescript
// app/api/accounts/route.ts
export const dynamic = 'force-dynamic'; // ou 'force-static'
export const revalidate = 60; // revalidar a cada 60 segundos
export const fetchCache = 'force-cache';

export async function GET() {
  const accounts = await fetchAccounts();
  return Response.json(accounts);
}
```

### 5. Async Request APIs

APIs de request agora são assíncronas:

```typescript
import { cookies, headers } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const token = cookieStore.get('auth_token');
  const userAgent = headersList.get('user-agent');
  
  // ...
}
```

## Migration Strategy

### Fase 1: Setup Inicial

1. Criar novo projeto Next.js 16 na raiz
2. Configurar TypeScript, Tailwind, ESLint
3. Habilitar Turbopack e React Compiler (experimental)
4. Configurar variáveis de ambiente
5. Migrar tipos e interfaces

### Fase 2: Migração de Backend

1. Migrar Appwrite client e configurações
2. Migrar services do NestJS para lib/services
3. Criar API Routes para todos os endpoints
4. Migrar sistema de migrações de banco de dados
5. Implementar autenticação JWT e middleware

### Fase 3: Migração de Frontend

1. Migrar componentes UI para components/ui
2. Migrar layouts para components/layout
3. Converter Screens em Pages do App Router
4. Migrar hooks customizados
5. Implementar route groups (auth, dashboard)

### Fase 4: Integração e Testes

1. Conectar frontend com API Routes
2. Testar fluxos de autenticação
3. Testar CRUD de accounts, transactions, credit cards
4. Validar proteção de rotas
5. Testar em ambiente de desenvolvimento

### Fase 5: Otimização e Deploy

1. Otimizar bundle size
2. Implementar Server Components onde apropriado
3. Configurar caching
4. Preparar para deploy na Vercel
5. Documentar mudanças

## Performance Considerations

### Server Components

- Usar Server Components por padrão para páginas
- Marcar apenas componentes interativos como 'use client'
- Buscar dados no servidor sempre que possível

### Caching

```typescript
// Exemplo de cache em API Route
export const revalidate = 60; // Revalidar a cada 60 segundos

export async function GET() {
  const accounts = await fetchAccounts();
  return NextResponse.json(accounts);
}
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/assets/logo.png"
  alt="Horizon AI"
  width={200}
  height={50}
  priority
/>
```

## Security Considerations

### 1. Environment Variables

- Nunca expor API keys no cliente
- Usar `NEXT_PUBLIC_` apenas para variáveis públicas
- Validar variáveis de ambiente no startup

### 2. Authentication

- JWT armazenado em httpOnly cookies
- Tokens com expiração curta (7 dias)
- Refresh token strategy (futuro)

### 3. API Routes

- Validar todos os inputs
- Sanitizar dados do usuário
- Rate limiting (futuro)
- CORS configurado corretamente

### 4. Middleware

- Verificar autenticação em todas as rotas protegidas
- Redirecionar usuários não autenticados
- Validar tokens em cada requisição

## Deployment

### Vercel Configuration

**Arquivo**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // React 19.2 e Next.js 16 features
  experimental: {
    // React Compiler para otimização automática
    reactCompiler: true,
    
    // Partial Prerendering
    ppr: true,
    
    // Server Actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000'],
    },
    
    // Turbopack configuration (stable no Next.js 16)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Environment variables
  env: {
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
      },
    ],
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
```

### Environment Variables na Vercel

```
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d
NODE_ENV=production
```

## Documentation Updates

### README.md

- Instruções de instalação do Next.js
- Como rodar em desenvolvimento
- Como fazer build
- Como deployar na Vercel
- Estrutura de diretórios
- Como adicionar novas rotas

### Migration Guide

- Diferenças entre arquitetura antiga e nova
- Como encontrar código migrado
- Mudanças em padrões de código
- Breaking changes

## Rollback Plan

Caso a migração encontre problemas críticos:

1. Manter branch `main` com código Turborepo original
2. Desenvolver migração em branch `feat/nextjs-migration`
3. Testar extensivamente antes de merge
4. Manter backup do banco de dados
5. Documentar todos os passos para rollback se necessário
