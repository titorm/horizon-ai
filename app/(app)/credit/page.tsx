'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useAccounts } from '@/hooks/useAccounts';
import type { CreditCard, Account } from '@/lib/types';
import { PlusIcon } from '@/components/assets/Icons';

function CreditCardItem({ card, account }: { card: CreditCard; account?: Account }) {
  const availableLimit = card.credit_limit - card.used_limit;
  const usagePercentage = (card.used_limit / card.credit_limit) * 100;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-on-surface">{card.name}</h3>
          <p className="text-sm text-on-surface-variant">
            {account?.name || 'Unknown Account'} •••• {card.last_digits}
          </p>
        </div>
        {card.brand && (
          <span className="text-xs uppercase font-medium text-on-surface-variant px-2 py-1 bg-surface-variant/20 rounded">
            {card.brand}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-on-surface-variant">Used Limit</span>
            <span className="font-medium text-on-surface">
              R$ {card.used_limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-surface-variant/30 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                usagePercentage > 80 ? 'bg-error' : usagePercentage > 50 ? 'bg-tertiary' : 'bg-secondary'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-outline">
          <div>
            <p className="text-xs text-on-surface-variant">Available</p>
            <p className="text-sm font-medium text-on-surface">
              R$ {availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">Total Limit</p>
            <p className="text-sm font-medium text-on-surface">
              R$ {card.credit_limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex justify-between text-xs text-on-surface-variant pt-2">
          <span>Closing: Day {card.closing_day}</span>
          <span>Due: Day {card.due_day}</span>
        </div>
      </div>
    </Card>
  );
}

export default function CreditPage() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const [allCreditCards, setAllCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllCreditCards() {
      if (accountsLoading || !accounts.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cards: CreditCard[] = [];

        for (const account of accounts) {
          try {
            const response = await fetch(`/api/credit-cards/account/${account.$id}`, {
              credentials: 'include',
            });

            if (response.ok) {
              const accountCards = await response.json();
              cards.push(...accountCards);
            }
          } catch (error) {
            console.error(`Error fetching cards for account ${account.$id}:`, error);
          }
        }

        setAllCreditCards(cards);
      } catch (error) {
        console.error('Error fetching credit cards:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllCreditCards();
  }, [accounts, accountsLoading]);

  const totalLimit = allCreditCards.reduce((sum, card) => sum + card.credit_limit, 0);
  const totalUsed = allCreditCards.reduce((sum, card) => sum + card.used_limit, 0);
  const totalAvailable = totalLimit - totalUsed;

  if (loading || accountsLoading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-normal text-on-surface mb-6">Credit Cards</h1>
        <div className="space-y-4">
          <div className="h-32 bg-surface-variant/20 rounded-lg animate-pulse" />
          <div className="h-48 bg-surface-variant/20 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-normal text-on-surface">Credit Cards</h1>
          <p className="text-base text-on-surface-variant">Manage your credit cards and track spending</p>
        </div>
        <Button leftIcon={<PlusIcon className="w-5 h-5" />}>Add Credit Card</Button>
      </header>

      <main className="space-y-6">
        {allCreditCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <p className="text-sm text-on-surface-variant">Total Credit Limit</p>
              <p className="text-2xl font-medium text-on-surface">
                R$ {totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-on-surface-variant">Total Used</p>
              <p className="text-2xl font-medium text-error">
                R$ {totalUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-on-surface-variant">Available Credit</p>
              <p className="text-2xl font-medium text-secondary">
                R$ {totalAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </Card>
          </div>
        )}

        {allCreditCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCreditCards.map((card) => {
              const account = accounts.find((acc) => acc.$id === card.account_id);
              return <CreditCardItem key={card.$id} card={card} account={account} />;
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-on-primary-container" />
              </div>
              <h3 className="text-xl font-medium text-on-surface mb-2">No Credit Cards Yet</h3>
              <p className="text-on-surface-variant mb-6">
                Add your credit cards to track spending, manage limits, and stay on top of due dates.
              </p>
              <Button leftIcon={<PlusIcon className="w-5 h-5" />}>Add Your First Credit Card</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
