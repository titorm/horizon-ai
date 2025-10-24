"use client";
import { useState, useEffect, useCallback, use, useOptimistic } from 'react';
import { apiFetch } from '@/lib/config/api';
import type { CreditCard } from '@/lib/types';

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
  const [error, setError] = useState<string | null>(null);

  const fetchCreditCards = useCallback(async () => {
    try {
      setError(null);
      
      if (accountId) {
        const response = await apiFetch(`/credit-cards/account/${accountId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch credit cards');
        }
        return await response.json();
      }
      return [];
    } catch (err: any) {
      console.error('Error fetching credit cards:', err);
      setError(err.message || 'Failed to fetch credit cards');
      return [];
    }
  }, [accountId]);

  const creditCards = use(fetchCreditCards());

  const [optimisticCreditCards, setOptimisticCreditCards] = useOptimistic(
    creditCards,
    (state, { action, card }) => {
      switch (action) {
        case 'add':
          return [...state, card];
        case 'delete':
          return state.filter((c) => c.$id !== card.$id);
        default:
          return state;
      }
    }
  );

  const createCreditCard = async (input: CreateCreditCardInput) => {
    const newCard = {
      $id: `optimistic-${Date.now()}`,
      ...input,
      used_limit: 0,
    } as CreditCard;

    setOptimisticCreditCards({ action: 'add', card: newCard });

    try {
      const response = await apiFetch('/credit-cards', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create credit card');
      }
      
      await fetchCreditCards();
    } catch (err: any) {
      console.error('Error creating credit card:', err);
      setError(err.message || 'Failed to create credit card');
    }
  };

  const deleteCreditCard = async (creditCardId: string) => {
    const cardToDelete = creditCards.find((c) => c.$id === creditCardId);
    if (cardToDelete) {
      setOptimisticCreditCards({ action: 'delete', card: cardToDelete });
    }

    try {
      const response = await apiFetch(`/credit-cards/${creditCardId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete credit card');
      }
      
      await fetchCreditCards();
    } catch (err: any) {
      console.error('Error deleting credit card:', err);
      setError(err.message || 'Failed to delete credit card');
    }
  };

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
      
      const updatedData = await response.json();
      await fetchCreditCards();
      return updatedData;
    } catch (err: any) {
      console.error('Error updating credit card:', err);
      setError(err.message || 'Failed to update credit card');
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
      
      const updatedData = await response.json();
      await fetchCreditCards();
      return updatedData;
    } catch (err: any) {
      console.error('Error updating used limit:', err);
      setError(err.message || 'Failed to update used limit');
      throw err;
    }
  }, [fetchCreditCards]);

  return {
    creditCards: optimisticCreditCards,
    loading: false,
    error,
    createCreditCard,
    deleteCreditCard,
    updateCreditCard,
    updateUsedLimit,
  };
}

