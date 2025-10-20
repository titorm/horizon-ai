import React, { useMemo, useState } from 'react';
import { MOCK_TRANSACTIONS, AVAILABLE_CATEGORY_ICONS } from '../../constants';
import type { Transaction, TransactionType } from '../../types';
import { SearchIcon, FilterIcon, SwapIcon, PlusIcon, XIcon } from '../assets/Icons';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const TransactionItemSkeleton: React.FC = () => (
    <li className="flex items-center py-4 px-2">
        <Skeleton className="h-10 w-10 rounded-full mr-4" />
        <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-6 w-20" />
    </li>
);

const TransactionsScreenSkeleton: React.FC = () => (
    <>
        <header className="mb-8">
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-6 w-3/4" />
            <div className="mt-6 flex items-center gap-4">
                <div className="flex-grow max-w-sm">
                    <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
        </header>
        <main>
            {[...Array(2)].map((_, i) => (
                 <div key={i} className="mb-6">
                    <Skeleton className="h-5 w-1/4 mb-4" />
                    <ul className="divide-y divide-outline bg-surface-container rounded-xl">
                        {[...Array(3)].map((_, j) => <TransactionItemSkeleton key={j} />)}
                    </ul>
                </div>
            ))}
        </main>
    </>
);

const TransactionTypeBadge: React.FC<{type: TransactionType}> = ({ type }) => {
    const typeStyles: Record<TransactionType, string> = {
        credit: 'bg-blue-100 text-blue-800',
        debit: 'bg-orange-100 text-orange-800',
        pix: 'bg-green-100 text-green-800',
        boleto: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`capitalize px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles[type]}`}>
            {type}
        </span>
    );
};

const TransactionItem: React.FC<{ transaction: Transaction; onClick: () => void; }> = ({ transaction, onClick }) => {
    const isIncome = transaction.amount > 0;
    const amountColor = isIncome ? 'text-secondary' : 'text-on-surface';
    const formattedAmount = `${isIncome ? '+' : ''}${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    const Icon = transaction.icon;

    return (
        <li>
            <button onClick={onClick} className="w-full flex items-center py-3 px-2 text-left hover:bg-primary/5 rounded-lg transition-colors">
                <div className="p-3 bg-primary-container rounded-full mr-4">
                    <Icon className="w-5 h-5 text-on-primary-container" />
                </div>
                <div className="flex-grow">
                    <p className="font-medium text-on-surface">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span>{transaction.bankName}</span>
                        <span className="text-outline">|</span>
                        <span>{transaction.category}</span>
                        <span className="text-outline">|</span>
                        <TransactionTypeBadge type={transaction.type} />
                    </div>
                </div>
                <p className={`text-base font-medium ${amountColor}`}>{formattedAmount}</p>
            </button>
        </li>
    );
};

const formatDateForGrouping = (isoDate: string): string => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatDateForDetails = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const ActiveFilterTag: React.FC<{label: string; onRemove: () => void;}> = ({label, onRemove}) => (
    <div className="flex items-center bg-primary-container text-on-primary-container text-sm font-medium pl-3 pr-1 py-1 rounded-full">
        {label}
        <button onClick={onRemove} className="ml-1 p-0.5 rounded-full hover:bg-black/10">
            <XIcon className="w-4 h-4"/>
        </button>
    </div>
);


const TransactionsScreen: React.FC<{ isLoading: boolean, onShowToast: (message: string, type: 'success' | 'error') => void; }> = ({ isLoading, onShowToast }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const initialNewTransactionState = {
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        bankName: '',
        category: '',
        type: 'credit' as TransactionType,
        notes: '',
        flow: 'expense'
    };
    const [newTransaction, setNewTransaction] = useState(initialNewTransactionState);

    const [filters, setFilters] = useState({
        dateRange: 'all',
        category: 'all',
        account: 'all',
        minAmount: '',
        maxAmount: '',
    });

    const allCategories = useMemo(() => [...new Set(transactions.map(tx => tx.category))], [transactions]);
    const allAccounts = useMemo(() => [...new Set(transactions.map(tx => tx.bankName))], [transactions]);
    
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const searchMatch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = filters.category === 'all' || tx.category === filters.category;
            const accountMatch = filters.account === 'all' || tx.bankName === filters.account;
            const amount = Math.abs(tx.amount);
            const minAmountMatch = filters.minAmount === '' || amount >= parseFloat(filters.minAmount);
            const maxAmountMatch = filters.maxAmount === '' || amount <= parseFloat(filters.maxAmount);

            let dateMatch = true;
            if (filters.dateRange !== 'all') {
                const txDate = new Date(tx.date);
                const cutoffDate = new Date();
                if (filters.dateRange === '7d') cutoffDate.setDate(cutoffDate.getDate() - 7);
                else if (filters.dateRange === '30d') cutoffDate.setDate(cutoffDate.getDate() - 30);
                dateMatch = txDate >= cutoffDate;
            }
            return searchMatch && categoryMatch && accountMatch && minAmountMatch && maxAmountMatch && dateMatch;
        });
    }, [searchTerm, filters, transactions]);
    
    const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
        const dateGroup = formatDateForGrouping(tx.date);
        (acc[dateGroup] = acc[dateGroup] || []).push(tx);
        return acc;
    }, {} as Record<string, Transaction[]>);

    const totalSum = useMemo(() => filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0), [filteredTransactions]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const removeFilter = (filterKey: keyof typeof filters) => {
        const defaultValues = { dateRange: 'all', category: 'all', account: 'all', minAmount: '', maxAmount: '' };
        setFilters(prev => ({ ...prev, [filterKey]: defaultValues[filterKey] }));
    }

    const resetFilters = () => {
        setFilters({ dateRange: 'all', category: 'all', account: 'all', minAmount: '', maxAmount: '' });
        setSearchTerm('');
    };

    const handleOpenAddModal = () => {
        setNewTransaction(initialNewTransactionState);
        setIsAddModalOpen(true);
    };

    const handleAddNewTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const categoryIcon = AVAILABLE_CATEGORY_ICONS.find(c => c.name === newTransaction.category)?.component || SwapIcon;
        
        const finalAmount = newTransaction.flow === 'expense' 
            ? -Math.abs(newTransaction.amount) 
            : Math.abs(newTransaction.amount);

        const newTx: Transaction = {
            id: `manual-${Date.now()}`,
            description: newTransaction.description,
            amount: finalAmount,
            date: new Date(newTransaction.date).toISOString(),
            bankName: newTransaction.bankName,
            category: newTransaction.category,
            type: newTransaction.type,
            notes: newTransaction.notes,
            icon: categoryIcon,
        };
        setTransactions(prev => [newTx, ...prev]);
        setIsAddModalOpen(false);
        onShowToast('Transaction added successfully!', 'success');
    };

    if (isLoading) {
        return <TransactionsScreenSkeleton />;
    }
    
    const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length + (searchTerm ? 1 : 0);

    return (
        <>
            <header className="mb-8">
                <h1 className="text-4xl font-light text-on-surface">All Transactions</h1>
                <p className="text-base text-on-surface-variant mt-1">Search and filter your complete transaction history.</p>
                <div className="mt-6 flex items-center gap-4">
                    <div className="flex-grow max-w-sm">
                        <Input 
                            type="search" 
                            placeholder="Search transactions..."
                            leftIcon={<SearchIcon className="h-5 w-5 text-on-surface-variant" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Button variant="outlined" onClick={() => setShowFilters(!showFilters)} leftIcon={<FilterIcon className="w-5 h-5"/>}>
                        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </Button>
                    <Button leftIcon={<PlusIcon className="w-5 h-5"/>} onClick={handleOpenAddModal}>
                        Add Transaction
                    </Button>
                </div>
            </header>

            {showFilters && (
                 <Card className="p-4 mb-8 transition-all duration-300 ease-in-out">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
                        <Input id="minAmount" name="minAmount" label="Min Amount" type="number" placeholder="0.00" value={filters.minAmount} onChange={handleFilterChange} />
                        <Input id="maxAmount" name="maxAmount" label="Max Amount" type="number" placeholder="1000.00" value={filters.maxAmount} onChange={handleFilterChange} />
                         <div>
                            <label htmlFor="account" className="block text-sm font-medium text-on-surface-variant mb-1">Account</label>
                            <select id="account" name="account" value={filters.account} onChange={handleFilterChange} className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-200">
                                <option value="all">All Accounts</option>
                                {allAccounts.sort().map(acc => <option key={acc} value={acc}>{acc}</option>)}
                            </select>
                        </div>
                         <div>
                             <label htmlFor="category" className="block text-sm font-medium text-on-surface-variant mb-1">Category</label>
                            <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-200">
                                <option value="all">All Categories</option>
                                {allCategories.sort().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="dateRange" className="block text-sm font-medium text-on-surface-variant mb-1">Date</label>
                            <select id="dateRange" name="dateRange" value={filters.dateRange} onChange={handleFilterChange} className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-200">
                                <option value="all">All Time</option>
                                <option value="7d">Last 7 days</option>
                                <option value="30d">Last 30 days</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <Button variant="text" onClick={resetFilters}>Clear All Filters</Button>
                    </div>
                </Card>
            )}

            {activeFilterCount > 0 && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                    {searchTerm && <ActiveFilterTag label={`Search: "${searchTerm}"`} onRemove={() => setSearchTerm('')} />}
                    {filters.account !== 'all' && <ActiveFilterTag label={`Account: ${filters.account}`} onRemove={() => removeFilter('account')} />}
                    {filters.category !== 'all' && <ActiveFilterTag label={`Category: ${filters.category}`} onRemove={() => removeFilter('category')} />}
                    {filters.dateRange !== 'all' && <ActiveFilterTag label={`Date: Last ${filters.dateRange === '7d' ? '7' : '30'} days`} onRemove={() => removeFilter('dateRange')} />}
                    {(filters.minAmount || filters.maxAmount) && <ActiveFilterTag label={`Amount: ${filters.minAmount || '0'} - ${filters.maxAmount || '∞'}`} onRemove={() => {removeFilter('minAmount'); removeFilter('maxAmount');}} />}
                </div>
            )}

            <main>
                {Object.keys(groupedTransactions).length > 0 ? (
                     Object.entries(groupedTransactions).map(([date, transactions]) => (
                        <div key={date} className="mb-6">
                            <h2 className="font-medium text-sm text-on-surface-variant pb-2 border-b border-outline mb-2">{date}</h2>
                            <ul className="divide-y divide-outline bg-surface-container rounded-xl p-1">
                                {(transactions as Transaction[]).map(tx => <TransactionItem key={tx.id} transaction={tx} onClick={() => setSelectedTransaction(tx)} />)}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16">
                        <SearchIcon className="w-12 h-12 mx-auto text-outline" />
                        <h3 className="text-xl font-medium text-on-surface mt-4">No transactions found</h3>
                        <p className="text-on-surface-variant text-sm mt-1">Try adjusting your search or filter criteria.</p>
                        <Button variant="outlined" onClick={resetFilters} className="mt-4">Clear Filters</Button>
                    </div>
                )}
            </main>

            <footer className="mt-8 p-4 bg-surface-container rounded-lg flex justify-between items-center sticky bottom-6 shadow-md border border-outline">
                <p className="font-medium text-on-surface">Filtered Total:</p>
                <p className={`text-2xl font-medium ${totalSum >= 0 ? 'text-secondary' : 'text-error'}`}>
                    {totalSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
            </footer>

            {/* Add Transaction Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Transaction">
                <form onSubmit={handleAddNewTransaction}>
                    <div className="p-6 space-y-4">
                        <Input label="Description" id="description" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} required />
                        <div className="grid grid-cols-2 gap-4">
                             <Input label="Amount" id="amount" type="number" step="0.01" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})} required />
                             <div>
                                <label className="block text-sm font-medium text-on-surface-variant mb-1">Flow</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 text-center p-2 rounded-lg border cursor-pointer ${newTransaction.flow === 'expense' ? 'bg-primary-container border-primary' : 'border-outline'}`}><input type="radio" name="flow" value="expense" checked={newTransaction.flow === 'expense'} onChange={e => setNewTransaction({...newTransaction, flow: e.target.value})} className="sr-only"/>Expense</label>
                                    <label className={`flex-1 text-center p-2 rounded-lg border cursor-pointer ${newTransaction.flow === 'income' ? 'bg-primary-container border-primary' : 'border-outline'}`}><input type="radio" name="flow" value="income" checked={newTransaction.flow === 'income'} onChange={e => setNewTransaction({...newTransaction, flow: e.target.value})} className="sr-only"/>Income</label>
                                </div>
                             </div>
                        </div>
                         <Input label="Date" id="date" type="date" value={newTransaction.date} onChange={e => setNewTransaction({...newTransaction, date: e.target.value})} required />
                        <div className="grid grid-cols-2 gap-4">
                            <select name="account" value={newTransaction.bankName} onChange={e => setNewTransaction({...newTransaction, bankName: e.target.value})} required className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="" disabled>Select Account</option>
                                {allAccounts.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                             <select name="category" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} required className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="" disabled>Select Category</option>
                                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <select name="type" value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value as TransactionType})} required className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="credit">Credit Card</option>
                                <option value="debit">Debit</option>
                                <option value="pix">Pix</option>
                                <option value="boleto">Boleto</option>
                        </select>
                         <textarea id="notes" placeholder="Notes (optional)" rows={3} value={newTransaction.notes} onChange={e => setNewTransaction({...newTransaction, notes: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"/>
                    </div>
                    <div className="p-4 bg-surface-variant/20 flex justify-end gap-3">
                        <Button type="button" variant="outlined" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Transaction</Button>
                    </div>
                </form>
            </Modal>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <Modal isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} title="Transaction Details">
                    <div className="p-6">
                        <header className="text-center pb-4 border-b border-outline">
                            <p className="text-3xl font-light text-on-surface">{selectedTransaction.description}</p>
                            <p className={`text-4xl font-light mt-1 ${selectedTransaction.amount > 0 ? 'text-secondary' : 'text-on-surface'}`}>
                                {selectedTransaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </header>
                        <dl className="mt-4 space-y-3">
                            <div className="flex justify-between"><dt className="text-on-surface-variant">Date</dt><dd className="font-medium text-on-surface">{formatDateForDetails(selectedTransaction.date)}</dd></div>
                            <div className="flex justify-between"><dt className="text-on-surface-variant">Category</dt><dd className="font-medium text-on-surface">{selectedTransaction.category}</dd></div>
                            <div className="flex justify-between"><dt className="text-on-surface-variant">Account</dt><dd className="font-medium text-on-surface">{selectedTransaction.bankName}</dd></div>
                            <div className="flex justify-between"><dt className="text-on-surface-variant">Type</dt><dd className="font-medium text-on-surface"><TransactionTypeBadge type={selectedTransaction.type} /></dd></div>
                            {selectedTransaction.notes && (
                                <div className="pt-3 border-t border-outline">
                                    <dt className="text-on-surface-variant mb-1">Notes</dt>
                                    <dd className="text-on-surface text-sm bg-surface-variant/20 p-2 rounded-m whitespace-pre-wrap">{selectedTransaction.notes}</dd>
                                </div>
                            )}
                        </dl>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outlined" onClick={() => setSelectedTransaction(null)}>Close</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default TransactionsScreen;