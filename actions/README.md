# Server Actions

This directory contains Server Actions for React 19.2, which provide a way to execute server-side code directly from client components without creating API routes.

## Overview

Server Actions are functions marked with `'use server'` that can be called from client components. They integrate seamlessly with React 19.2's new hooks like `useActionState`, `useFormStatus`, and `useOptimistic`.

## Files

### `auth.actions.ts`

Authentication-related Server Actions:

- `loginAction` - Authenticate user with email/password
- `registerAction` - Create new user account
- `logoutAction` - Clear authentication and redirect
- `loginAndRedirectAction` - Login with automatic redirect
- `registerAndRedirectAction` - Register with automatic redirect

### `account.actions.ts`

Bank account management Server Actions:

- `createAccountAction` - Create new bank account
- `updateAccountAction` - Update account details
- `deleteAccountAction` - Delete account
- `getAccountsAction` - Fetch user's accounts (for use with 'use' hook)
- `getAccountByIdAction` - Fetch single account

### `transaction.actions.ts`

Transaction management Server Actions:

- `createTransactionAction` - Create new transaction
- `updateTransactionAction` - Update transaction details
- `deleteTransactionAction` - Delete transaction
- `getTransactionsAction` - Fetch transactions with filters (for use with 'use' hook)
- `getTransactionByIdAction` - Fetch single transaction
- `getTransactionStatsAction` - Get transaction statistics

## Usage Examples

### 1. Using with useActionState

```typescript
'use client';

import { loginAction } from '@/actions/auth.actions';
import { useActionState } from 'react';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
  });

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

### 2. Using with useFormStatus

```typescript
'use client';

import { createAccountAction } from '@/actions/account.actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Account'}
    </button>
  );
}

export function CreateAccountForm() {
  return (
    <form action={createAccountAction}>
      <input name="name" required />
      <select name="account_type" required>
        <option value="checking">Checking</option>
        <option value="savings">Savings</option>
      </select>
      <SubmitButton />
    </form>
  );
}
```

### 3. Using with useOptimistic

```typescript
'use client';

import { createTransactionAction } from '@/actions/transaction.actions';
import { useOptimistic, useState } from 'react';

export function TransactionList({ initialTransactions }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [optimisticTransactions, addOptimistic] = useOptimistic(
    transactions,
    (state, newTransaction) => [...state, { ...newTransaction, isPending: true }]
  );

  async function handleCreate(formData: FormData) {
    // Add optimistically
    addOptimistic({
      id: 'temp',
      amount: parseFloat(formData.get('amount')),
      type: formData.get('type'),
    });

    // Call server action
    const result = await createTransactionAction(null, formData);

    if (result.success) {
      setTransactions(prev => [...prev, result.transaction]);
    }
  }

  return (
    <form action={handleCreate}>
      {/* form fields */}
      <button type="submit">Create</button>

      {optimisticTransactions.map(tx => (
        <div key={tx.id}>
          {tx.amount} {tx.isPending && '(Saving...)'}
        </div>
      ))}
    </form>
  );
}
```

### 4. Using with 'use' hook

```typescript
'use client';

import { getTransactionsAction } from '@/actions/transaction.actions';
import { Suspense, use } from 'react';

function TransactionList({ transactionsPromise }) {
  // The 'use' hook unwraps the promise
  const { transactions } = use(transactionsPromise);

  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>{tx.amount}</div>
      ))}
    </div>
  );
}

export function TransactionsPage() {
  const transactionsPromise = getTransactionsAction({ limit: 50 });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionList transactionsPromise={transactionsPromise} />
    </Suspense>
  );
}
```

## Action State Types

All actions that work with `useActionState` return a consistent state structure:

```typescript
interface ActionState {
  success: boolean;
  error?: string;
  [key: string]: any; // Additional data specific to the action
}
```

## Best Practices

1. **Always validate input** - Server Actions receive untrusted data from the client
2. **Use requireAuth()** - Ensure user is authenticated before performing actions
3. **Revalidate paths** - Call `revalidatePath()` to update cached data after mutations
4. **Handle errors gracefully** - Return error messages in the action state
5. **Use TypeScript** - Type your form data and action states for better DX
6. **Combine with useOptimistic** - Provide instant feedback for better UX
7. **Use Suspense boundaries** - Wrap components using 'use' hook with Suspense

## Security Considerations

- All Server Actions run on the server with full access to your backend
- Always validate and sanitize user input
- Use authentication checks (`requireAuth()`) for protected actions
- Never expose sensitive data in action responses
- Rate limit actions if necessary (implement in middleware)

## Performance Tips

- Use `revalidatePath()` instead of `revalidateTag()` when possible (more specific)
- Batch multiple actions when appropriate
- Use `useOptimistic` to reduce perceived latency
- Consider using `useTransition` for non-urgent updates
- Implement proper loading states with `useFormStatus`

## Migration from API Routes

Server Actions can replace many API routes:

**Before (API Route):**

```typescript
// app/api/accounts/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // ... create account
  return Response.json(account);
}

// Client
const response = await fetch('/api/accounts', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

**After (Server Action):**

```typescript
// actions/account.actions.ts
'use server'
export async function createAccountAction(prevState, formData) {
  // ... create account
  return { success: true, account };
}

// Client
<form action={createAccountAction}>
  {/* form fields */}
</form>
```

## Related Documentation

- [React 19.2 Actions Documentation](https://react.dev/reference/react/actions)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [useActionState Hook](https://react.dev/reference/react/useActionState)
- [useOptimistic Hook](https://react.dev/reference/react/useOptimistic)
- [useFormStatus Hook](https://react.dev/reference/react-dom/hooks/useFormStatus)
