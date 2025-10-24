'use client';

/**
 * Login Form Example using React 19.2 useActionState
 * Demonstrates how to use Server Actions with form state management
 */

import { loginAction, type AuthActionState } from '@/actions/auth.actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

/**
 * Submit button component using useFormStatus
 * This hook provides the pending state of the parent form
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

/**
 * Login form component using useActionState
 * This demonstrates the React 19.2 pattern for handling Server Actions
 */
export function LoginFormExample() {
  // useActionState manages the form state and action execution
  // It returns [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    loginAction,
    { success: false }, // Initial state
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login Example</h2>

      <form action={formAction} className="space-y-4">
        {/* Email input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        {/* Error message */}
        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}

        {/* Success message */}
        {state?.success && state.user && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">Welcome back, {state.user.firstName || state.user.email}!</p>
          </div>
        )}

        {/* Submit button with useFormStatus */}
        <SubmitButton />

        {/* Alternative: Show pending state from useActionState */}
        {isPending && (
          <p className="text-sm text-gray-500 text-center">Authenticating...</p>
        )}
      </form>
    </div>
  );
}
