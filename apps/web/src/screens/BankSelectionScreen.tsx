import React, { useState, useMemo, useEffect } from "react";
import { BANKS } from "../constants";
import type { Bank } from "../types";
import { ChevronRightIcon, SearchIcon } from "../assets/Icons";

interface BankSelectionScreenProps {
    onSelectBank: (bank: Bank) => void;
}

const BankListItem: React.FC<{ bank: Bank; onSelect: () => void; visible: boolean }> = ({
    bank,
    onSelect,
    visible,
}) => {
    const Logo = bank.logo;
    return (
        <li
            className={`transition-all duration-500 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
            <button
                onClick={onSelect}
                className="w-full flex items-center p-4 h-[72px] text-left rounded-lg hover:bg-primary/5 focus:bg-primary/10 focus:outline-none"
            >
                <Logo className="h-10 w-10 mr-4" />
                <span className="flex-grow text-base font-normal text-on-surface">{bank.name}</span>
                <ChevronRightIcon className="h-6 w-6 text-on-surface-variant" />
            </button>
        </li>
    );
};

const BankSelectionScreen: React.FC<BankSelectionScreenProps> = ({ onSelectBank }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

    const filteredBanks = useMemo(
        () => BANKS.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm]
    );

    useEffect(() => {
        filteredBanks.forEach((bank, index) => {
            setTimeout(() => {
                setVisibleItems((prev) => new Set(prev).add(bank.id));
            }, index * 50);
        });
    }, [filteredBanks]);

    return (
        <div className="max-w-xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
            <header className="py-8">
                <h1 className="text-2xl md:text-3xl font-normal text-center mb-6">Choose your bank</h1>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-on-surface-variant" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search for your bank"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-surface border border-outline rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
            </header>
            <main className="flex-grow">
                <ul className="space-y-2">
                    {filteredBanks.map((bank) => (
                        <BankListItem
                            key={bank.id}
                            bank={bank}
                            onSelect={() => onSelectBank(bank)}
                            visible={visibleItems.has(bank.id)}
                        />
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default BankSelectionScreen;
