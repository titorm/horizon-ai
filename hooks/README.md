# Custom Hooks with React 19.2 Features

This directory contains custom React hooks that leverage the latest React 19.2 features for optimal performance and user experience.

## React 19.2 Features Used

### 1. **useOptimistic** - Instant UI Updates

All CRUD hooks (`useAccounts`, `useCreditCards`, `useTransactions`) implement optimistic updates using React 19.2's `useOptimistic` hook. This provides instant feedback to users while the server request is in progress.

**Example:**

```tsx
const [optimisticAccounts, addOptimisticUpdate] = useOptimistic(accounts, (state, update) => {
  // Update logic here
});
```

**Benefits:**

- Instant UI feedback
- Automatic rollback on errors
- Better perceived performance

### 2. **useTransition** - Non-Blocking Updates

State updates are wrapped in `useTransition` to prevent blocking the UI during optimistic updates.

**Example:**

```tsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  addOptimisticUpdate({ type: 'add', account: newAccount });
});
```

**Benefits:**

- UI remains responsive during updates
- Loading states are automatically managed
- Smooth user experience

### 3. **useFormStatus** - Form Submission States

The `useFormSubmit` hook wraps React 19.2's `useFormStatus` to provide easy access to form submission state.

**Example:**

```tsx
function SubmitButton() {
  const { pending } = useFormSubmit();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}
```

**Benefits:**

- Automatic loading states
- No manual state management needed
- Works seamlessly with Server Actions

## Available Hooks

### useAccounts

Manages bank accounts with optimistic updates.

```tsx
const {
  accounts, // Optimistic account list
  loading, // Loading state
  error, // Error state
  fetchAccounts, // Fetch all accounts
  createAccount, // Create with optimistic update
  updateAccount, // Update with optimistic update
  deleteAccount, // Delete with optimistic update
  getAccountBalance, // Get single account balance
} = useAccounts({ initialAccounts });
```

### useCreditCards

Manages credit cards with optimistic updates.

```tsx
const {
  creditCards, // Optimistic credit card list
  loading, // Loading state
  error, // Error state
  fetchCreditCards, // Fetch cards for account
  createCreditCard, // Create with optimistic update
  updateCreditCard, // Update with optimistic update
  deleteCreditCard, // Delete with optimistic update
  updateUsedLimit, // Update used limit with optimistic update
} = useCreditCards({ accountId, initialCreditCards });
```

### useTransactions

Manages transactions with optimistic updates and filtering.

```tsx
const {
  transactions, // Optimistic transaction list
  total, // Total count
  loading, // Loading state
  error, // Error state
  fetchTransactions, // Fetch with filters
  createTransaction, // Create with optimistic update
  updateTransaction, // Update with optimistic update
  deleteTransaction, // Delete with optimistic update
  refetch, // Refetch with filters
} = useTransactions({ userId, initialTransactions, initialTotal });
```

### useFinancialInsights

Analyzes transactions to generate AI-powered insights.

```tsx
const insights = useFinancialInsights(transactions);
// Returns: FinancialInsight[]
```

**Features:**

- Detects unusual spending patterns
- Generates cash flow forecasts
- Uses `useMemo` for efficient computation

### useTotalBalance

Calculates total balance across all accounts.

```tsx
const {
  totalBalance, // Current total balance
  loading, // Loading state
  error, // Error state
  refreshTotalBalance, // Refresh calculation
} = useTotalBalance({ initialBalance });
```

### useFormSubmit

Helper hook for form submission states (wraps `useFormStatus`).

```tsx
const { pending, data, method, action } = useFormSubmit();
```

**Also includes SubmitButton component:**

```tsx
<form action={myAction}>
  <input name="email" />
  <SubmitButton pendingText="Signing in...">Sign In</SubmitButton>
</form>
```

## Usage Examples

### Basic CRUD with Optimistic Updates

```tsx
'use client';

import { useAccounts } from '@/hooks';

export function AccountsList() {
  const { accounts, loading, createAccount, deleteAccount } = useAccounts();

  const handleCreate = async () => {
    try {
      await createAccount({
        name: 'New Account',
        account_type: 'checking',
        initial_balance: 1000,
      });
      // UI updates instantly, then confirms with server
    } catch (error) {
      // Automatically rolled back on error
      console.error('Failed to create account:', error);
    }
  };

  return (
    <div>
      {accounts.map((account) => (
        <div key={account.$id}>
          {account.name}: ${account.balance}
          <button onClick={() => deleteAccount(account.$id)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleCreate}>Add Account</button>
    </div>
  );
}
```

### Form with useFormStatus

```tsx
'use client';

import { SubmitButton } from '@/hooks';
import { createAccountAction } from '@/actions/account.actions';

export function CreateAccountForm() {
  return (
    <form action={createAccountAction}>
      <input name="name" placeholder="Account Name" required />
      <input name="balance" type="number" placeholder="Initial Balance" />
      <SubmitButton pendingText="Creating...">
        Create Account
      </SubmitButton>
    </form>
  );
}
```

### Financial Insights

```tsx
'use client';

import { useTransactions, useFinancialInsights } from '@/hooks';

export function InsightsPanel({ userId }: { userId: string }) {
  const { transactions } = useTransactions({ userId });
  const insights = useFinancialInsights(transactions);

  return (
    <div>
      {insights.map((insight) => (
        <div key={insight.$id}>
          <h3>{insight.title}</h3>
          <p>{insight.description}</p>
          <button>{insight.actionText}</button>
        </div>
      ))}
    </div>
  );
}
```

## Migration from Old Hooks

### Before (React 18)

```tsx
const { accounts, loading, error } = useAccounts();

// Manual optimistic update
const handleCreate = async (data) => {
  setAccounts([...accounts, tempAccount]); // Manual
  try {
    const result = await createAccount(data);
    setAccounts([...accounts, result]); // Manual
  } catch (error) {
    setAccounts(accounts); // Manual rollback
  }
};
```

### After (React 19.2)

```tsx
const { accounts, loading, error, createAccount } = useAccounts();

// Automatic optimistic update
const handleCreate = async (data) => {
  await createAccount(data); // Automatic optimistic update + rollback
};
```

## Best Practices

1. **Always use optimistic updates for better UX** - Users see instant feedback
2. **Handle errors gracefully** - Optimistic updates automatically rollback on error
3. **Use SubmitButton for forms** - Automatic loading states without manual management
4. **Leverage useMemo in insights** - Efficient computation of derived data
5. **Pass initial data when available** - Reduces loading states on mount

## API Endpoints

All hooks expect the following API structure:

- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `PATCH /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `GET /api/credit-cards/account/:accountId` - List credit cards
- `POST /api/credit-cards` - Create credit card
- `PATCH /api/credit-cards/:id` - Update credit card
- `DELETE /api/credit-cards/:id` - Delete credit card
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions/manual` - Create transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## TypeScript Support

All hooks are fully typed with TypeScript. Import types from `@/lib/types`:

```tsx
import type { Account, CreateAccountDto, CreditCard, Transaction, UpdateAccountDto } from '@/lib/types';
```
