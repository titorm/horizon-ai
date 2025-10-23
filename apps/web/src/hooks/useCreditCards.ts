import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../config/api';
import type { CreditCard } from '../types';

export interface CreateCreditCardInput {
  account_id: string;
  name: string;
  last_digits: string;
  credit_limit: number;
  used_limit?: number;
  closing_day: number;
  due_day: number;
  brand?: 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';
  network?: string;
  color?: string;
}

export interface UpdateCreditCardInput {
  name?: string;
  credit_limit?: number;
  used_limit?: number;
  closing_day?: number;
  due_day?: number;
  brand?: 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';
  network?: string;
  color?: string;
}

export function useCreditCards(accountId: string | null) {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (accountId) {
        // Fetch cards for specific account
        response = await apiFetch(`/credit-cards/account/${accountId}`);
      } else {
        // Fetch all cards for the user (we'll need to create this endpoint or fetch from all accounts)
        // For now, let's set empty array - we'll populate this after accounts are loaded
        setCreditCards([]);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch credit cards');
      }
      const data = await response.json();
      setCreditCards(data);
    } catch (err: any) {
      console.error('Error fetching credit cards:', err);
      setError(err.message || 'Failed to fetch credit cards');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const createCreditCard = useCallback(async (input: CreateCreditCardInput) => {
    try {
      setError(null);
      const response = await apiFetch('/credit-cards', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create credit card');
      }
      
      const data = await response.json();
      await fetchCreditCards(); // Refresh the list
      return data;
    } catch (err: any) {
      console.error('Error creating credit card:', err);
      setError(err.message || 'Failed to create credit card');
      throw err;
    }
  }, [fetchCreditCards]);

  const updateCreditCard = useCallback(async (creditCardId: string, input: UpdateCreditCardInput) => {
    try {
      setError(null);
      const response = await apiFetch(`/credit-cards/${creditCardId}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update credit card');
      }
      
      const data = await response.json();
      await fetchCreditCards(); // Refresh the list
      return data;
    } catch (err: any) {
      console.error('Error updating credit card:', err);
      setError(err.message || 'Failed to update credit card');
      throw err;
    }
  }, [fetchCreditCards]);

  const deleteCreditCard = useCallback(async (creditCardId: string) => {
    try {
      setError(null);
      const response = await apiFetch(`/credit-cards/${creditCardId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete credit card');
      }
      
      await fetchCreditCards(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting credit card:', err);
      setError(err.message || 'Failed to delete credit card');
      throw err;
    }
  }, [fetchCreditCards]);

  const updateUsedLimit = useCallback(async (creditCardId: string, usedLimit: number) => {
    try {
      setError(null);
      const response = await apiFetch(`/credit-cards/${creditCardId}/used-limit`, {
        method: 'PUT',
        body: JSON.stringify({ usedLimit }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update used limit');
      }
      
      const data = await response.json();
      await fetchCreditCards(); // Refresh the list
      return data;
    } catch (err: any) {
      console.error('Error updating used limit:', err);
      setError(err.message || 'Failed to update used limit');
      throw err;
    }
  }, [fetchCreditCards]);

  useEffect(() => {
    fetchCreditCards();
  }, [fetchCreditCards]);

  return {
    creditCards,
    loading,
    error,
    fetchCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    updateUsedLimit,
  };
}

