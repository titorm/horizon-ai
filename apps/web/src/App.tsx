import React, { useState, useEffect } from "react";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import BankSelectionScreen from "./screens/BankSelectionScreen";
import SecurityInterstitialScreen from "./screens/SecurityInterstitialScreen";
import LoadingScreen from "./screens/LoadingScreen";
import DashboardLayout from "./components/layout/DashboardLayout";
import Toast from "./components/ui/Toast";

import SuccessionScreen from "./screens/SuccessionScreen";
import InsuranceScreen from "./screens/InsuranceScreen";
import IntegrationsScreen from "./screens/IntegrationsScreen";
import PlanningGoalsScreen from "./screens/PlanningGoalsScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import FamilyScreen from "./screens/FamilyScreen";
import ComplianceScreen from "./screens/ComplianceScreen";

import DashboardOverviewScreen from "./screens/DashboardOverviewScreen";
import AccountsScreen from "./screens/AccountsScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import InvoicesScreen from "./screens/InvoicesScreen";
import TaxScreen from "./screens/TaxScreen";
import WarrantiesScreen from "./screens/WarrantiesScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HelpScreen from "./screens/HelpScreen";
import PricingScreen from "./screens/PricingScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";

import type { Bank, Screen, User } from "./types";
import { MOCK_USER } from "./constants";

const USER_STORAGE_KEY = "horizonUser";

function App() {
    const [screen, setScreen] = useState<Screen>("landing");
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setScreen("dashboard/overview");
                simulateLoading();
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem(USER_STORAGE_KEY);
            setIsLoading(false);
        }
    }, []);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        let timer: number | undefined = undefined;
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            setToast(null);
            timer = undefined;
        }, 3000);
    };

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2500);
    };

    const handleGoToRegister = () => setScreen("register");
    const handleGoToLogin = () => setScreen("login");

    const handleRegister = () => {
        setUser(MOCK_USER);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USER));
        setScreen("welcome");
        showToast("Account created successfully!", "success");
    };

    const handleLogin = () => {
        setUser(MOCK_USER);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USER));
        setScreen("dashboard/overview");
        showToast(`Welcome back, ${MOCK_USER.name}!`, "success");
        simulateLoading();
    };

    const handleConnect = () => setScreen("onboarding/select-bank");
    const handleSelectBank = (bank: Bank) => {
        setSelectedBank(bank);
        setScreen("onboarding/security");
    };

    const handleSecurityContinue = () => {
        setScreen("onboarding/loading");
        setTimeout(() => {
            setScreen("dashboard/overview");
            showToast(`Successfully connected to ${selectedBank?.name}!`, "success");
            simulateLoading();
        }, 5000);
    };

    const handleBack = () => {
        if (screen === "onboarding/security") setScreen("onboarding/select-bank");
        if (screen === "login" || screen === "register") setScreen("landing");
    };

    const handleConnectAnother = () => {
        setSelectedBank(null);
        setScreen("onboarding/select-bank");
    };

    const handleUpgrade = () => setScreen("dashboard/pricing");

    const handleSelectPlan = () => {
        if (user) {
            // FIX: Explicitly type `updatedUser` to ensure its 'role' property conforms to the `UserRole` type.
            const updatedUser: User = { ...user, role: "PREMIUM" };
            setUser(updatedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
            setScreen("dashboard/overview");
            showToast("You've upgraded to Premium!", "success");
        }
    };

    const handleLogout = () => {
        setUser(null);
        setSelectedBank(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        setScreen("landing");
    };

    const renderCurrentScreen = () => {
        if (isLoading && !user) {
            // Only show full-page loading if we're checking for a user initially
            return (
                <div className="min-h-screen flex items-center justify-center bg-surface">
                    <div className="text-xl text-on-surface-variant">Horizon AI</div>
                </div>
            );
        }

        if (!user) {
            switch (screen) {
                case "landing":
                    return <LandingScreen onGetStarted={handleGoToRegister} onLogin={handleGoToLogin} />;
                case "login":
                    return (
                        <LoginScreen onLogin={handleLogin} onBack={handleBack} onGoToRegister={handleGoToRegister} />
                    );
                case "register":
                    return (
                        <RegisterScreen onRegister={handleRegister} onBack={handleBack} onGoToLogin={handleGoToLogin} />
                    );
                default:
                    return <LandingScreen onGetStarted={handleGoToRegister} onLogin={handleGoToLogin} />;
            }
        }

        switch (screen) {
            case "welcome":
                return <WelcomeScreen onConnect={handleConnect} />;
            case "onboarding/select-bank":
                return <BankSelectionScreen onSelectBank={handleSelectBank} />;
            case "onboarding/security":
                return (
                    <SecurityInterstitialScreen
                        bankName={selectedBank?.name || ""}
                        onContinue={handleSecurityContinue}
                        onBack={handleBack}
                    />
                );
            case "onboarding/loading":
                return <LoadingScreen />;
            case "dashboard/pricing":
                return <PricingScreen onSelectPlan={handleSelectPlan} onBack={() => setScreen("dashboard/overview")} />;

            // Default to dashboard layout for all other screens
            default:
                return (
                    <DashboardLayout user={user} activeScreen={screen} onNavigate={setScreen} onLogout={handleLogout}>
                        {(() => {
                            switch (screen) {
                                case "dashboard/overview":
                                    return (
                                        <DashboardOverviewScreen
                                            user={user}
                                            onConnectAnother={handleConnectAnother}
                                            isLoading={isLoading}
                                        />
                                    );
                                case "dashboard/accounts":
                                    return <AccountsScreen isLoading={isLoading} />;
                                case "dashboard/transactions":
                                    return <TransactionsScreen isLoading={isLoading} onShowToast={showToast} />;
                                case "dashboard/categories":
                                    return <CategoriesScreen />;
                                case "dashboard/invoices":
                                    return <InvoicesScreen userRole={user.role} onUpgrade={handleUpgrade} />;
                                case "dashboard/warranties":
                                    return <WarrantiesScreen userRole={user.role} onUpgrade={handleUpgrade} />;
                                case "dashboard/taxes":
                                    return (
                                        <TaxScreen
                                            userRole={user.role}
                                            onUpgrade={handleUpgrade}
                                            onShowToast={showToast}
                                        />
                                    );

                                case "dashboard/notifications":
                                    return <NotificationsScreen />;
                                case "dashboard/settings":
                                    return <SettingsScreen onShowToast={showToast} />;
                                case "dashboard/help":
                                    return <HelpScreen />;

                                // Phase 4 Screens
                                case "dashboard/succession":
                                    return <SuccessionScreen />;
                                case "dashboard/insurance":
                                    return <InsuranceScreen />;
                                case "dashboard/integrations":
                                    return <IntegrationsScreen />;
                                case "dashboard/planning-goals":
                                    return <PlanningGoalsScreen onShowToast={showToast} />;
                                case "dashboard/shopping-list":
                                    return <ShoppingListScreen onShowToast={showToast} />;
                                case "dashboard/analytics":
                                    return <AnalyticsScreen />;
                                case "dashboard/family":
                                    return <FamilyScreen />;
                                case "dashboard/compliance":
                                    return <ComplianceScreen />;

                                default:
                                    return (
                                        <DashboardOverviewScreen
                                            user={user}
                                            onConnectAnother={handleConnectAnother}
                                            isLoading={isLoading}
                                        />
                                    );
                            }
                        })()}
                    </DashboardLayout>
                );
        }
    };

    return (
        <>
            {renderCurrentScreen()}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;
