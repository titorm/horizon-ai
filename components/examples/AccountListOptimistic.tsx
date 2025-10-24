'use client';

/**
 * Account List with Optimistic Updates using React 19.2 useOptimistic
 * Demonstrates how to provide instant UI feedback before server confirmation
 */

import { createAccountAction, deleteAccountAction } from '@/actions/account.actions';
import { useOptimistic, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  isPending?: boolean;
}

interface AccountListOptimisticProps {
  initialAccounts: Account[];
}

/**
 * Submit button for the add account form
 */
function AddAccountButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Adding...' : 'Add Account'}
    </button>
  );
}

/**
 * Account list component with optimistic updates
 */
export function AccountListOptimistic({ initialAccounts }: AccountListOptimisticProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isPending, startTransition] = useTransition();

  // useOptimistic hook for instant UI updates
  const [optimisticAccounts, addOptimisticAccount] = useOptimistic(
    accounts,
    (state, newAccount: Account) => {
      // Add the new account with a pending flag
      return [...state, { ...newAccount, isPending: true }];
    },
  );

  // Handle account creation with optimistic update
  async function handleCreateAccount(formData: FormData) {
    const name = formData.get('name') as string;
    const accountType = formData.get('account_type') as string;
    const initialBalance = parseFloat(formData.get('initial_balance') as string) || 0;

    // Create temporary account for optimistic update
    const tempAccount: Account = {
      id: `temp-${Date.now()}`,
      name,
      type: accountType,
      balance: initialBalance,
      isPending: true,
    };

    // Add optimistically
    addOptimisticAccount(tempAccount);

    // Start transition for the actual server action
    startTransition(async () => {
      const result = await createAccountAction(null, formData);

      if (result.success && result.account) {
        // Update with real account data
        setAccounts((prev) => [
          ...prev,
          {
            id: result.account.id,
            name: result.account.name,
            type: result.account.type,
            balance: result.account.balance,
          },
        ]);
      } else {
        // Revert optimistic update on error
        console.error('Failed to create account:', result.error);
      }
    });
  }

  // Handle account deletion with optimistic update
  function handleDeleteAccount(accountId: string) {
    // Optimistically remove the account
    const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
    setAccounts(updatedAccounts);

    // Start transition for the actual server action
    startTransition(async () => {
      const result = await deleteAccountAction(accountId);

      if (!result.success) {
        // Revert on error
        console.error('Failed to delete account:', result.error);
        setAccounts(accounts); // Restore original state
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Accounts with Optimistic Updates</h2>

      {/* Add Account Form */}
      <form action={handleCreateAccount} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="My Checking Account"
            />
          </div>

          <div>
            <label htmlFor="account_type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="account_type"
              name="account_type"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="initial_balance" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Balance
            </label>
            <input
              type="number"
              id="initial_balance"
              name="initial_balance"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        <AddAccountButton />
      </form>

      {/* Account List */}
      <div className="space-y-4">
        {optimisticAccounts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No accounts yet. Add your first account above!</p>
        ) : (
          optimisticAccounts.map((account) => (
            <div
              key={account.id}
              className={`p-4 border rounded-lg flex justify-between items-center ${
                account.isPending ? 'opacity-50 bg-gray-50' : 'bg-white'
              }`}
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {account.name}
                  {account.isPending && (
                    <span className="ml-2 text-sm text-gray-500">(Saving...)</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{account.type}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-xl font-bold text-green-600">
                  ${account.balance.toFixed(2)}
                </p>

                {!account.isPending && (
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isPending && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Processing...
        </div>
      )}
    </div>
  );
}
