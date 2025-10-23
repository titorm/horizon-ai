import { useState, useEffect, useCallback, useEffectEvent } from 'react';
import { apiFetch, API_URL } from '../config/api';
import type { Account } from '../types';

export interface CreateAccountInput {
  name: string;
  account_type: 'checking' | 'savings' | 'investment' | 'other';
  initial_balance?: number;
  is_manual?: boolean;
  bank_id?: string;
  last_digits?: string;
  status?: 'Connected' | 'Sync Error' | 'Disconnected' | 'Manual';
}

export interface UpdateAccountInput {
  name?: string;
  account_type?: 'checking' | 'savings' | 'investment' | 'other';
  bank_id?: string;
  last_digits?: string;
  status?: 'Connected' | 'Sync Error' | 'Disconnected' | 'Manual';
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useEffectEvent(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  });

  const createAccount = useEffectEvent(async (input: CreateAccountInput) => {
    try {
      setError(null);
      const response = await apiFetch('/accounts', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account');
      }
      
      const data = await response.json();
      
      // If there's an initial balance, we should create a transaction for it
      // This will be handled by the backend or we can add it here
      
      await fetchAccounts(); // Refresh the list
      return data;
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError(err.message || 'Failed to create account');
      throw err;
    }
  });

  const updateAccount = useEffectEvent(async (accountId: string, input: UpdateAccountInput) => {
    try {
      setError(null);
      const response = await apiFetch(`/accounts/${accountId}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account');
      }
      
      const data = await response.json();
      await fetchAccounts(); // Refresh the list
      return data;
    } catch (err: any) {
      console.error('Error updating account:', err);
      setError(err.message || 'Failed to update account');
      throw err;
    }
  });

  const deleteAccount = useEffectEvent(async (accountId: string) => {
    try {
      setError(null);
      const response = await apiFetch(`/accounts/${accountId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }
      
      await fetchAccounts(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account');
      throw err;
    }
  });

  const getAccountBalance = useEffectEvent(async (accountId: string): Promise<number> => {
    try {
      const response = await apiFetch(`/accounts/${accountId}/balance`);
      if (!response.ok) {
        throw new Error('Failed to get account balance');
      }
      const data = await response.json();
      return data.balance;
    } catch (err: any) {
      console.error('Error getting account balance:', err);
      throw err;
    }
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountBalance,
  };
}

