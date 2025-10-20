import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { MOCK_BALANCE, MOCK_TRANSACTIONS } from "../constants";
import type { Transaction } from "../types";

interface DashboardScreenProps {
    userName: string;
    onConnectAnother: () => void;
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.amount > 0;
    const amountColor = isIncome ? "text-secondary" : "text-on-surface";
    const formattedAmount = `${isIncome ? "+" : "-"}R$ ${Math.abs(transaction.amount).toFixed(2)}`;

    return (
        <li className="flex items-center py-3">
            <div className="flex-grow">
                <p className="text-base font-normal text-on-surface">{transaction.description}</p>
                <p className="text-sm text-on-surface-variant">
                    {transaction.date} • {transaction.bankName}
                </p>
            </div>
            <p className={`text-base font-medium ${amountColor}`}>{formattedAmount}</p>
        </li>
    );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ userName, onConnectAnother }) => {
    const formattedBalance = MOCK_BALANCE.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="py-6">
                <h1 className="text-3xl font-normal text-on-surface">Hi, {userName}!</h1>
                <p className="text-base text-on-surface-variant">Welcome to your financial dashboard.</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <Card className="p-6">
                        <p className="text-sm font-medium text-on-surface-variant mb-1">Total Balance</p>
                        <h2 className="text-5xl font-normal text-primary">{formattedBalance}</h2>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-medium text-on-surface">Recent Transactions</h3>
                            <Button onClick={onConnectAnother} variant="outlined">
                                Connect Another Account
                            </Button>
                        </div>
                        <ul className="divide-y divide-outline">
                            {MOCK_TRANSACTIONS.map((tx) => (
                                <TransactionItem key={tx.id} transaction={tx} />
                            ))}
                        </ul>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default DashboardScreen;
