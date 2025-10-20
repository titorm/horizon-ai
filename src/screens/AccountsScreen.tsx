import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { BANKS } from '../../constants';
import { DotsVerticalIcon, PlusIcon, RefreshCwIcon, WalletIcon } from '../assets/Icons';
import Skeleton from '../components/ui/Skeleton';
// FIX: Import types for strong typing
import type { Account, Bank, AccountStatus } from '../../types';

// Mock data for this screen
// FIX: Strongly type mock data array
const initialAccounts: Account[] = [
  { id: '1', bankId: 'itau', lastDigits: '1234', balance: 15000.75, status: 'Connected', lastSync: '2 minutes ago' },
  { id: '2', bankId: 'nubank', lastDigits: '5678', balance: 9537.79, status: 'Connected', lastSync: '5 minutes ago' },
  { id: '3', bankId: 'bradesco', lastDigits: '9012', balance: 0, status: 'Sync Error', lastSync: '1 day ago' },
];

const AccountCardSkeleton: React.FC = () => (
    <Card className="p-4 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
        <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="text-right space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    </Card>
);

const AccountsScreenSkeleton: React.FC = () => (
    <>
        <header className="flex justify-between items-center mb-8">
            <div>
                <Skeleton className="h-10 w-80 mb-2" />
                <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
        </header>
        <main className="space-y-4">
            {[...Array(3)].map((_, i) => <AccountCardSkeleton key={i} />)}
        </main>
    </>
);

// FIX: Add props interface for type safety
interface AccountCardProps {
    account: Account;
    onDisconnect: (bank: Bank) => void;
    onSync: (accountId: string) => void;
    isSyncing: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onDisconnect, onSync, isSyncing }) => {
  const bank = BANKS.find(b => b.id === account.bankId);
  if (!bank) return null;
  const Logo = bank.logo;

  const statusColor: Record<AccountStatus, string> = {
    'Connected': 'bg-secondary',
    'Sync Error': 'bg-tertiary',
    'Disconnected': 'bg-on-surface-variant',
  };

  return (
    <Card className="p-4 flex items-center gap-4">
      <Logo className="h-10 w-10 flex-shrink-0" />
      <div className="flex-grow">
        <div className="flex items-center gap-2">
            <p className="font-medium text-on-surface">{bank.name}</p>
            <div className={`w-2 h-2 rounded-full ${statusColor[account.status]}`}></div>
        </div>
        <p className="text-sm text-on-surface-variant">**** {account.lastDigits}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-lg text-on-surface">{account.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <p className="text-xs text-on-surface-variant">{isSyncing ? 'Syncing...' : `Last sync: ${account.lastSync}`}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="text" className="px-2 h-auto py-2 !rounded-full" aria-label="Refresh" onClick={() => onSync(account.id)} disabled={isSyncing}>
          <RefreshCwIcon className={`h-5 w-5 text-on-surface-variant ${isSyncing ? 'animate-spin' : ''}`}/>
        </Button>
        <Button variant="text" onClick={() => onDisconnect(bank)} className="px-2 h-auto py-2 !rounded-full" aria-label="More options">
            <DotsVerticalIcon className="h-5 w-5 text-on-surface-variant"/>
        </Button>
      </div>
    </Card>
  );
};

const AccountsScreen: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    // FIX: Strongly type state
    const [accountToDisconnect, setAccountToDisconnect] = useState<Bank | null>(null);

    // FIX: Strongly type function parameter
    const handleDisconnectClick = (bank: Bank) => {
        setAccountToDisconnect(bank);
        setIsModalOpen(true);
    };

    const confirmDisconnect = () => {
        if (accountToDisconnect) {
            setAccounts(prev => prev.filter(acc => acc.bankId !== accountToDisconnect.id));
            setIsModalOpen(false);
            setAccountToDisconnect(null);
        }
    };
    
    const handleSync = (accountId: string) => {
        setSyncingAccounts(prev => new Set(prev).add(accountId));
        
        // Simulate sync process
        setTimeout(() => {
            setAccounts(prevAccounts => 
                prevAccounts.map(acc => 
                    acc.id === accountId 
                        ? { ...acc, status: 'Connected', lastSync: 'just now', balance: acc.balance * (1 + (Math.random() - 0.5) * 0.1) } // also update balance slightly
                        : acc
                )
            );
            setSyncingAccounts(prev => {
                const newSet = new Set(prev);
                newSet.delete(accountId);
                return newSet;
            });
        }, 2500);
    };

    if (isLoading) {
        return <AccountsScreenSkeleton />;
    }

    return (
        <>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-light text-on-surface">Your Connected Accounts</h1>
                    <p className="text-base text-on-surface-variant mt-1">Manage your linked financial institutions.</p>
                </div>
                <Button leftIcon={<PlusIcon className="w-5 h-5"/>}>Connect New Account</Button>
            </header>
            <main className="space-y-4">
                {accounts.length > 0 ? (
                    accounts.map(acc => (
                        <AccountCard 
                            key={acc.id} 
                            account={acc} 
                            onDisconnect={handleDisconnectClick}
                            onSync={handleSync}
                            isSyncing={syncingAccounts.has(acc.id)}
                        />
                    ))
                ) : (
                    <Card className="p-8 text-center flex flex-col items-center">
                        <div className="p-3 bg-primary-container rounded-full mb-4">
                            <WalletIcon className="w-8 h-8 text-on-primary-container" />
                        </div>
                        <h3 className="text-xl font-medium text-on-surface">No Accounts Connected</h3>
                        <p className="text-on-surface-variant mt-1 mb-6 max-w-sm">
                            Connect your first bank account to start tracking your finances with Horizon AI.
                        </p>
                        <Button leftIcon={<PlusIcon className="w-5 h-5"/>}>Connect New Account</Button>
                    </Card>
                )}
            </main>
             {accountToDisconnect && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    title="Confirm Account Disconnection"
                >
                    <div className="p-6">
                        <p className="text-on-surface-variant mb-6">
                            Are you sure you want to disconnect your {accountToDisconnect.name} account? This will stop syncing new transactions and remove the account from your dashboard. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button className="bg-error hover:opacity-90" onClick={confirmDisconnect}>Disconnect</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default AccountsScreen;