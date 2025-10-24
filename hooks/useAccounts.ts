"use client";
import { useState, useEffect, useCallback, use, useOptimistic } from 'react';
import { apiFetch } from '@/lib/config/api';
import type { Account } from '@/lib/types';

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
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setError(null);
      const response = await apiFetch('/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      return await response.json();
    } catch (err: any) {
      console.error('Error fetching accounts:', err);
      setError(err.message || 'Failed to fetch accounts');
      return [];
    }
  }, []);

  const accounts = use(fetchAccounts());

  const [optimisticAccounts, setOptimisticAccounts] = useOptimistic(
    accounts,
    (state, { action, account }) => {
      switch (action) {
        case 'add':
          return [...state, account];
        case 'delete':
          return state.filter((a) => a.$id !== account.$id);
        default:
          return state;
      }
    }
  );

  const createAccount = async (input: CreateAccountInput) => {
    const newAccount = {
      $id: `optimistic-${Date.now()}`,
      ...input,
      balance: input.initial_balance || 0,
    } as Account;

    setOptimisticAccounts({ action: 'add', account: newAccount });

    try {
      const response = await apiFetch('/accounts', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account');
      }
      
      await fetchAccounts();
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError(err.message || 'Failed to create account');
    }
  };

  const deleteAccount = async (accountId: string) => {
    const accountToDelete = accounts.find((a) => a.$id === accountId);
    if (accountToDelete) {
      setOptimisticAccounts({ action: 'delete', account: accountToDelete });
    }

    try {
      const response = await apiFetch(`/accounts/${accountId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }
      
      await fetchAccounts();
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account');
    }
  };

  const updateAccount = useCallback(async (accountId: string, input: UpdateAccountInput) => {
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
  }, [fetchAccounts]);

  const getAccountBalance = useCallback(async (accountId: string): Promise<number> => {
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
  }, []);

  return {
    accounts: optimisticAccounts,
    loading: false,
    error,
    createAccount,
    deleteAccount,
    updateAccount,
    getAccountBalance,
  };
}

