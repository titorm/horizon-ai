'use client';

/**
 * Comprehensive demo of React 19.2 features
 * This component showcases all the new hooks and patterns
 */

import { Suspense, use, useOptimistic, useState, useTransition } from 'react';

/**
 * Example 1: use hook with promises
 */
interface DataPromiseProps {
  dataPromise: Promise<{ message: string; timestamp: number }>;
}

function DataWithUseHook({ dataPromise }: DataPromiseProps) {
  // The 'use' hook unwraps the promise
  const data = use(dataPromise);

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="font-medium text-green-900">Data loaded with 'use' hook:</p>
      <p className="text-sm text-green-700">{data.message}</p>
      <p className="text-xs text-green-600">Timestamp: {new Date(data.timestamp).toLocaleString()}</p>
    </div>
  );
}

/**
 * Example 2: useOptimistic for instant updates
 */
interface OptimisticItem {
  id: string;
  text: string;
  isPending?: boolean;
}

function OptimisticListDemo() {
  const [items, setItems] = useState<OptimisticItem[]>([
    { id: '1', text: 'Existing item 1' },
    { id: '2', text: 'Existing item 2' },
  ]);

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: OptimisticItem) => {
      return [...state, { ...newItem, isPending: true }];
    },
  );

  const [isPending, startTransition] = useTransition();

  function handleAddItem() {
    const newItem: OptimisticItem = {
      id: `temp-${Date.now()}`,
      text: `New item ${items.length + 1}`,
    };

    // Add optimistically
    addOptimisticItem(newItem);

    // Simulate server action
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update with "real" data
      setItems((prev) => [
        ...prev,
        {
          id: `real-${Date.now()}`,
          text: newItem.text,
        },
      ]);
    });
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAddItem}
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        Add Item (Optimistic)
      </button>

      <div className="space-y-2">
        {optimisticItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 border rounded-md ${
              item.isPending ? 'opacity-50 bg-gray-50' : 'bg-white'
            }`}
          >
            {item.text}
            {item.isPending && <span className="ml-2 text-sm text-gray-500">(Saving...)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 3: useTransition for non-urgent updates
 */
function TransitionDemo() {
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    setInput(value);

    // Mark this update as non-urgent
    startTransition(() => {
      // Simulate expensive computation
      const newList = Array.from({ length: 1000 }, (_, i) => `${value} - Item ${i + 1}`);
      setList(newList);
    });
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Type to generate list..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      {isPending && (
        <p className="text-sm text-gray-500">Updating list...</p>
      )}

      <div className="max-h-40 overflow-y-auto border rounded-md p-2">
        {list.slice(0, 10).map((item, i) => (
          <div key={i} className="text-sm py-1">
            {item}
          </div>
        ))}
        {list.length > 10 && (
          <p className="text-xs text-gray-500 mt-2">...and {list.length - 10} more items</p>
        )}
      </div>
    </div>
  );
}

/**
 * Main demo component
 */
export function React19FeaturesDemo() {
  // Create a promise for the 'use' hook demo
  const dataPromise = new Promise<{ message: string; timestamp: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'This data was loaded using the new "use" hook!',
        timestamp: Date.now(),
      });
    }, 1000);
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">React 19.2 Features Demo</h1>
        <p className="text-gray-600">
          This page demonstrates the new features available in React 19.2
        </p>
      </div>

      {/* Feature 1: use hook */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">1. The 'use' Hook</h2>
        <p className="text-sm text-gray-600 mb-4">
          The new 'use' hook allows you to consume promises and context directly in render.
          It works with Suspense boundaries for automatic loading states.
        </p>

        <Suspense
          fallback={
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          }
        >
          <DataWithUseHook dataPromise={dataPromise} />
        </Suspense>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Key benefit:</strong> No need for useEffect or useState for async data.
            The component suspends automatically while the promise resolves.
          </p>
        </div>
      </section>

      {/* Feature 2: useOptimistic */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">2. useOptimistic Hook</h2>
        <p className="text-sm text-gray-600 mb-4">
          useOptimistic provides instant UI feedback before server confirmation.
          Perfect for creating responsive user experiences.
        </p>

        <OptimisticListDemo />

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Key benefit:</strong> Users see immediate feedback. If the server action fails,
            the optimistic update is automatically reverted.
          </p>
        </div>
      </section>

      {/* Feature 3: useTransition */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">3. useTransition Hook</h2>
        <p className="text-sm text-gray-600 mb-4">
          useTransition marks updates as non-urgent, keeping the UI responsive during
          expensive operations.
        </p>

        <TransitionDemo />

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Key benefit:</strong> The input remains responsive even while generating
            a large list. React prioritizes the input update over the list update.
          </p>
        </div>
      </section>

      {/* Feature 4: Server Actions */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">4. Server Actions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Server Actions allow you to call server-side functions directly from client components
          without creating API routes.
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <pre className="text-sm overflow-x-auto">
            {`// Server Action
'use server'
export async function createItem(formData: FormData) {
  const name = formData.get('name')
  await db.items.create({ name })
}

// Client Component
'use client'
export function Form() {
  return (
    <form action={createItem}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  )
}`}
          </pre>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Key benefit:</strong> Simplified data mutations without API routes.
            Works seamlessly with forms and progressive enhancement.
          </p>
        </div>
      </section>

      {/* Feature 5: useFormStatus */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">5. useFormStatus Hook</h2>
        <p className="text-sm text-gray-600 mb-4">
          useFormStatus provides the status of a parent form, perfect for submit buttons
          and loading indicators.
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <pre className="text-sm overflow-x-auto">
            {`'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}`}
          </pre>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Key benefit:</strong> Automatic loading states for form submissions
            without manual state management.
          </p>
        </div>
      </section>

      {/* Feature 6: useActionState */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">6. useActionState Hook</h2>
        <p className="text-sm text-gray-600 mb-4">
          useActionState (formerly useFormState) manages the state of Server Actions,
          providing error handling and success feedback.
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <pre className="text-sm overflow-x-auto">
            {`'use client'
import { useActionState } from 'react'

function Form() {
  const [state, formAction, isPending] = useActionState(
    serverAction,
    { error: null }
  )
  
  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}
      <button disabled={isPending}>Submit</button>
    </form>
  )
}`}
          </pre>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Key benefit:</strong> Simplified error handling and state management
            for Server Actions with built-in pending state.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p className="text-gray-700 mb-4">
          React 19.2 introduces powerful new primitives that simplify common patterns:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>use:</strong> Consume promises and context directly in render</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>useOptimistic:</strong> Instant UI feedback with automatic rollback</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>useTransition:</strong> Non-blocking updates for better UX</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Server Actions:</strong> Direct server calls without API routes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>useFormStatus:</strong> Automatic form submission states</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>useActionState:</strong> Simplified Server Action state management</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
