# React 19.2 Feature Examples

This directory contains example components demonstrating the new features in React 19.2 and how to use them with Next.js 16 Server Actions.

## Components

### 1. `LoginFormExample.tsx`

Demonstrates `useActionState` and `useFormStatus` for form handling.

**Features:**

- Form state management with `useActionState`
- Loading states with `useFormStatus`
- Error and success message handling
- Server Action integration

**Usage:**

```typescript
import { LoginFormExample } from '@/components/examples';

export default function LoginPage() {
  return <LoginFormExample />;
}
```

### 2. `AccountListOptimistic.tsx`

Demonstrates `useOptimistic` for instant UI feedback.

**Features:**

- Optimistic updates for create/delete operations
- Automatic rollback on errors
- Loading indicators for pending operations
- `useTransition` for non-blocking updates

**Usage:**

```typescript
import { AccountListOptimistic } from '@/components/examples';

export default function AccountsPage() {
  const accounts = await getAccounts(); // Server Component

  return <AccountListOptimistic initialAccounts={accounts} />;
}
```

### 3. `TransactionListWithUse.tsx`

Demonstrates the new `use` hook for consuming promises.

**Features:**

- Promise consumption with `use` hook
- Suspense boundaries for loading states
- Automatic error handling
- Multiple patterns for using the `use` hook

**Usage:**

```typescript
import { TransactionListWithUse } from '@/components/examples';

export default function TransactionsPage() {
  return <TransactionListWithUse />;
}
```

### 4. `CreateTransactionForm.tsx`

Comprehensive example combining multiple React 19.2 features.

**Features:**

- `useActionState` for form state
- `useFormStatus` for submit button
- `useOptimistic` for instant feedback
- Recent transactions list with optimistic updates

**Usage:**

```typescript
import { CreateTransactionForm } from '@/components/examples';

export default function NewTransactionPage() {
  return (
    <CreateTransactionForm
      onTransactionCreated={(tx) => console.log('Created:', tx)}
    />
  );
}
```

### 5. `React19FeaturesDemo.tsx`

Complete demonstration of all React 19.2 features with explanations.

**Features:**

- Interactive examples of all new hooks
- Code snippets and explanations
- Visual demonstrations
- Best practices and use cases

**Usage:**

```typescript
import { React19FeaturesDemo } from '@/components/examples';

export default function DemoPage() {
  return <React19FeaturesDemo />;
}
```

## React 19.2 Features Covered

### 1. `use` Hook

Consume promises and context directly in render:

```typescript
import { use } from 'react';

function Component({ dataPromise }) {
  const data = use(dataPromise);
  return <div>{data.message}</div>;
}
```

**Key Points:**

- Works with Suspense boundaries
- No need for useEffect or useState
- Automatic loading states
- Can be used conditionally (unlike other hooks)

### 2. `useOptimistic` Hook

Provide instant UI feedback before server confirmation:

```typescript
import { useOptimistic } from 'react';

function Component({ items }) {
  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (state, newItem) => [...state, newItem]
  );

  async function handleAdd(item) {
    addOptimistic(item); // Instant UI update
    await serverAction(item); // Server confirmation
  }

  return <List items={optimisticItems} />;
}
```

**Key Points:**

- Automatic rollback on errors
- Perfect for CRUD operations
- Improves perceived performance
- Works with Server Actions

### 3. `useActionState` Hook

Manage Server Action state and execution:

```typescript
import { useActionState } from 'react';

function Component() {
  const [state, formAction, isPending] = useActionState(
    serverAction,
    { error: null }
  );

  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

**Key Points:**

- Replaces useFormState (renamed in React 19.2)
- Built-in pending state
- Error handling
- Progressive enhancement

### 4. `useFormStatus` Hook

Access form submission status in child components:

```typescript
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

**Key Points:**

- Must be used in child of form
- Automatic loading states
- No manual state management
- Works with Server Actions

### 5. `useTransition` Hook

Mark updates as non-urgent to keep UI responsive:

```typescript
import { useTransition } from 'react';

function Component() {
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    startTransition(() => {
      // Non-urgent update
      setExpensiveState(newValue);
    });
  }

  return <button onClick={handleUpdate}>Update</button>;
}
```

**Key Points:**

- Keeps UI responsive during expensive operations
- Shows pending state
- Prioritizes urgent updates
- Great for search/filter operations

### 6. Server Actions

Execute server-side code directly from client components:

```typescript
// Server Action
'use server'
export async function createItem(formData: FormData) {
  const name = formData.get('name');
  await db.items.create({ name });
  revalidatePath('/items');
}

// Client Component
'use client'
export function Form() {
  return (
    <form action={createItem}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

**Key Points:**

- No API routes needed
- Progressive enhancement
- Type-safe with TypeScript
- Automatic serialization

## Best Practices

### 1. Combine Features for Best UX

```typescript
function OptimizedForm() {
  // Use all features together
  const [state, formAction] = useActionState(serverAction, null);
  const [optimisticItems, addOptimistic] = useOptimistic(items);

  return (
    <form action={async (formData) => {
      addOptimistic(/* ... */); // Instant feedback
      await formAction(formData); // Server action
    }}>
      <SubmitButton /> {/* Uses useFormStatus */}
    </form>
  );
}
```

### 2. Use Suspense Boundaries

```typescript
<Suspense fallback={<Skeleton />}>
  <ComponentWithUseHook dataPromise={promise} />
</Suspense>
```

### 3. Handle Errors Gracefully

```typescript
const [state, formAction] = useActionState(serverAction, {
  success: false,
  error: null,
});

return (
  <form action={formAction}>
    {state.error && (
      <div className="error">{state.error}</div>
    )}
  </form>
);
```

### 4. Provide Loading States

```typescript
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? (
        <>
          <Spinner />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </button>
  );
}
```

### 5. Optimize for Performance

```typescript
// Use useTransition for non-urgent updates
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  setQuery(query); // Urgent: update input

  startTransition(() => {
    setResults(expensiveSearch(query)); // Non-urgent: update results
  });
}
```

## Common Patterns

### Pattern 1: Form with Optimistic Updates

```typescript
function FormWithOptimistic({ items }) {
  const [optimisticItems, addOptimistic] = useOptimistic(items);
  const [state, formAction] = useActionState(createAction, null);

  return (
    <form action={async (formData) => {
      addOptimistic(/* temp item */);
      await formAction(formData);
    }}>
      {/* form fields */}
      <List items={optimisticItems} />
    </form>
  );
}
```

### Pattern 2: Data Fetching with 'use'

```typescript
function DataComponent() {
  const dataPromise = fetchData();

  return (
    <Suspense fallback={<Loading />}>
      <DataDisplay dataPromise={dataPromise} />
    </Suspense>
  );
}

function DataDisplay({ dataPromise }) {
  const data = use(dataPromise);
  return <div>{data}</div>;
}
```

### Pattern 3: Multi-Step Form

```typescript
function MultiStepForm() {
  const [state, formAction, isPending] = useActionState(submitAction, {
    step: 1,
    data: {},
  });

  return (
    <form action={formAction}>
      {state.step === 1 && <Step1 />}
      {state.step === 2 && <Step2 />}
      {state.step === 3 && <Step3 />}
      <SubmitButton />
    </form>
  );
}
```

## Testing Examples

### Testing Server Actions

```typescript
import { createAccountAction } from '@/actions/account.actions';

describe('createAccountAction', () => {
  it('should create account successfully', async () => {
    const formData = new FormData();
    formData.set('name', 'Test Account');
    formData.set('account_type', 'checking');

    const result = await createAccountAction(null, formData);

    expect(result.success).toBe(true);
    expect(result.account).toBeDefined();
  });
});
```

### Testing Components with useActionState

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginFormExample } from './LoginFormExample';

test('shows error on invalid login', async () => {
  render(<LoginFormExample />);

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'invalid@example.com' },
  });

  fireEvent.click(screen.getByText('Login'));

  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

## Resources

- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Actions Documentation](https://react.dev/reference/react/actions)
- [useOptimistic Hook](https://react.dev/reference/react/useOptimistic)
- [use Hook](https://react.dev/reference/react/use)

## Contributing

When adding new examples:

1. Follow the existing component structure
2. Include comprehensive comments
3. Add usage examples in this README
4. Demonstrate best practices
5. Include error handling
6. Add TypeScript types
