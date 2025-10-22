import React, { useState } from "react";
import {
    HomeIcon,
    WalletIcon,
    SwapIcon,
    PieChartIcon,
    FileTextIcon,
    SettingsIcon,
    HelpCircleIcon,
    LogOutIcon,
    ShieldCheckIcon,
    LandmarkIcon,
    UsersIcon,
    RepeatIcon,
    ReceiptIcon,
    ShieldIcon,
    ShoppingCartIcon,
} from "../../assets/Icons";
import Modal from "../ui/Modal";
import type { Screen, User } from "../../types";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center p-2.5 rounded-lg text-sm font-medium transition-colors
        ${isActive ? "bg-primary-container text-primary" : "text-on-surface-variant hover:bg-on-surface/5"}`}
        >
            <div className="mr-3">{icon}</div>
            {label}
        </button>
    );
};

const NavSection: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-2.5 pt-4 pb-2 text-xs font-medium text-on-surface-variant/70 uppercase tracking-wider">
        {title}
    </h3>
);

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: User;
    activeScreen: Screen;
    onNavigate: (screen: Screen) => void;
    onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, activeScreen, onNavigate, onLogout }) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        onLogout();
    };

    const mainNav = [
        { id: "dashboard/overview", label: "Overview", icon: <HomeIcon className="w-5 h-5" /> },
        { id: "dashboard/accounts", label: "Accounts", icon: <WalletIcon className="w-5 h-5" /> },
        { id: "dashboard/transactions", label: "Transactions", icon: <SwapIcon className="w-5 h-5" /> },
    ];

    const intelligenceNav = [
        { id: "dashboard/categories", label: "Categories", icon: <PieChartIcon className="w-5 h-5" /> },
        { id: "dashboard/shopping-list", label: "Shopping Lists", icon: <ShoppingCartIcon className="w-5 h-5" /> },
        { id: "dashboard/invoices", label: "Invoices", icon: <ReceiptIcon className="w-5 h-5" /> },
        { id: "dashboard/warranties", label: "Warranties", icon: <ShieldCheckIcon className="w-5 h-5" /> },
    ];

    const planningNav = [
        { id: "dashboard/taxes", label: "Taxes (IRPF)", icon: <FileTextIcon className="w-5 h-5" /> },
        { id: "dashboard/planning-goals", label: "Financial Goals", icon: <LandmarkIcon className="w-5 h-5" /> },
        { id: "dashboard/succession", label: "Succession", icon: <UsersIcon className="w-5 h-5" /> },
    ];

    const ecosystemNav = [
        { id: "dashboard/insurance", label: "Insurance", icon: <ShieldIcon className="w-5 h-5" /> },
        { id: "dashboard/integrations", label: "Integrations", icon: <RepeatIcon className="w-5 h-5" /> },
    ];

    const secondaryNav = [
        { id: "dashboard/settings", label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
        { id: "dashboard/help", label: "Help & Support", icon: <HelpCircleIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-surface">
            <aside className="w-72 bg-surface flex-shrink-0 p-4 flex flex-col border-r border-outline">
                <div className="text-2xl font-light text-primary mb-8 px-2.5">Horizon AI</div>

                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    <nav className="space-y-1.5">
                        {mainNav.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isActive={activeScreen === item.id}
                                onClick={() => onNavigate(item.id as Screen)}
                            />
                        ))}
                    </nav>

                    <NavSection title="Intelligence" />
                    <nav className="space-y-1.5">
                        {intelligenceNav.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isActive={activeScreen === item.id}
                                onClick={() => onNavigate(item.id as Screen)}
                            />
                        ))}
                    </nav>

                    <NavSection title="Wealth Management" />
                    <nav className="space-y-1.5">
                        {planningNav.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isActive={activeScreen === item.id}
                                onClick={() => onNavigate(item.id as Screen)}
                            />
                        ))}
                    </nav>

                    <NavSection title="Ecosystem" />
                    <nav className="space-y-1.5">
                        {ecosystemNav.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isActive={activeScreen === item.id}
                                onClick={() => onNavigate(item.id as Screen)}
                            />
                        ))}
                    </nav>
                </div>

                <div className="pt-4 mt-4 border-t border-outline">
                    <div className="p-2.5 flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-on-surface">{user.name}</p>
                            <p className="text-xs text-on-surface-variant">
                                {user.role === "PREMIUM" ? "Premium Member" : "Free Member"}
                            </p>
                        </div>
                    </div>
                    <nav className="space-y-1.5">
                        {secondaryNav.map((item) => (
                            <NavItem
                                key={item.id}
                                {...item}
                                isActive={activeScreen === item.id}
                                onClick={() => onNavigate(item.id as Screen)}
                            />
                        ))}
                        <NavItem
                            label="Log Out"
                            icon={<LogOutIcon className="w-5 h-5" />}
                            isActive={false}
                            onClick={handleLogoutClick}
                        />
                    </nav>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-10">{children}</div>
            </main>

            {/* Logout Confirmation Modal */}
            <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirmar Logout">
                <div className="p-6">
                    <p className="text-on-surface-variant mb-6">
                        Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o
                        sistema.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface hover:bg-on-surface/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmLogout}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DashboardLayout;
