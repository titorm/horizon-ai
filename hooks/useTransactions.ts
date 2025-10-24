"use client";
import { useState, useEffect, useCallback, use, useOptimistic } from 'react';
import { apiFetch } from '@/lib/config/api';
import { apiEndpoints } from '@/lib/config/api';

// API Response types
interface ApiTransaction {
  $id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  category?: string;
  description?: string;
  currency?: string;
  source?: 'manual' | 'integration' | 'import';
  accountId?: string;
  creditCardId?: string;
  merchant?: string;
  integrationId?: string;
  tags?: string[];
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiTransactionResponse {
  success: boolean;
  data: ApiTransaction[];
  total: number;
  limit: number;
  offset: number;
}

interface TransactionFilters {
  userId?: string;
  type?: 'income' | 'expense' | 'transfer';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  category?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export function useTransactions(userId: string | null) {
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (filters?: TransactionFilters) => {
    if (!userId) {
      return { data: [], total: 0 };
    }

    try {
      const params = new URLSearchParams();
      params.append('userId', userId);
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await apiFetch(`${apiEndpoints.transactions.list}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data: ApiTransactionResponse = await response.json();
      
      if (data.success) {
        return { data: data.data, total: data.total };
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { data: [], total: 0 };
    }
  }, [userId]);

  const { data, total } = use(fetchTransactions());

  const [optimisticTransactions, setOptimisticTransactions] = useOptimistic(
    data,
    (state, { action, transaction }) => {
      switch (action) {
        case 'add':
          return [...state, transaction];
        case 'delete':
          return state.filter((t) => t.$id !== transaction.$id);
        default:
          return state;
      }
    }
  );

  const refetch = useCallback((filters?: TransactionFilters) => {
    return fetchTransactions(filters);
  }, [fetchTransactions]);

  return {
    transactions: optimisticTransactions,
    isLoading: false,
    error,
    total,
    refetch,
    setOptimisticTransactions,
  };
}

export async function createTransaction(data: {
  userId: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description?: string;
  date: string;
  currency?: string;
  accountId?: string;
  creditCardId?: string;
  merchant?: string;
  tags?: string[];
}): Promise<ApiTransaction> {
  const response = await apiFetch(apiEndpoints.transactions.create, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to create transaction');
  }

  return result.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  const response = await apiFetch(apiEndpoints.transactions.delete(id), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
}
