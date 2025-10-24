"use client";
import { useState, useEffect, useCallback, use } from "react";
import { apiFetch } from "@/lib/config/api";
import { apiEndpoints } from "@/lib/config/api";

interface Account {
    id: string;
    balance: number;
}

export const useTotalBalance = () => {
    const [error, setError] = useState<string | null>(null);

    const calculateTotalBalance = useCallback(async () => {
        try {
            const response = await apiFetch(apiEndpoints.accounts.list);
            
            if (!response.ok) {
                throw new Error("Failed to fetch accounts");
            }
            
            const accounts: Account[] = await response.json();
            
            // Sum all account balances
            return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
        } catch (err: any) {
            setError(err.message || "Failed to calculate total balance");
            return 0;
        }
    }, []);

    const totalBalance = use(calculateTotalBalance());

    return {
        totalBalance,
        loading: false,
        error,
        refreshTotalBalance: calculateTotalBalance,
    };
};
