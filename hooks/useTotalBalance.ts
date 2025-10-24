'use client';

import { useState, useCallback } from 'react';

interface Account {
  $id: string;
  balance: number;
}

interface UseTotalBalanceOptions {
  initialBalance?: number;
}

/**
 * Hook for calculating total balance across all accounts
 * Uses React 19.2 patterns for efficient state management
 */
export function useTotalBalance(options: UseTotalBalanceOptions = {}) {
  const [totalBalance, setTotalBalance] = useState<number>(options.initialBalance || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotalBalance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/accounts', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const accounts: Account[] = await response.json();

      // Sum all account balances
      const total = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

      setTotalBalance(total);
    } catch (err: any) {
      console.error('Error calculating total balance:', err);
      setError(err.message || 'Failed to calculate total balance');
      setTotalBalance(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    totalBalance,
    loading,
    error,
    refreshTotalBalance: calculateTotalBalance,
  };
}
