import { useState, useEffect, useEffectEvent } from "react";
import { apiFetch, apiEndpoints } from "../config/api";

interface Account {
    id: string;
    balance: number;
}

export const useTotalBalance = () => {
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calculateTotalBalance = useEffectEvent(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiFetch(apiEndpoints.accounts.list);
            
            if (!response.ok) {
                throw new Error("Failed to fetch accounts");
            }
            
            const accounts: Account[] = await response.json();
            
            // Sum all account balances
            const total = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
            
            setTotalBalance(total);
        } catch (err: any) {
            setError(err.message || "Failed to calculate total balance");
            setTotalBalance(0);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        calculateTotalBalance();
    }, []);

    return {
        totalBalance,
        loading,
        error,
        refreshTotalBalance: calculateTotalBalance,
    };
};
