import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { MOCK_WARRANTIES } from "../constants";
import type { Warranty, UserRole } from "../types";
import { PlusIcon, AlertTriangleIcon, ShieldCheckIcon } from "../assets/Icons";

const WarrantyCard: React.FC<{ warranty: Warranty }> = ({ warranty }) => {
    const { productName, purchaseDate, expiresAt, daysRemaining } = warranty;
    let statusColor = "bg-secondary";
    if (daysRemaining < 30) statusColor = "bg-error";
    else if (daysRemaining < 90) statusColor = "bg-tertiary";

    return (
        <Card className="p-4 overflow-hidden relative">
            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${statusColor}`}></div>
            <div className="ml-4">
                <p className="font-medium text-on-surface">{productName}</p>
                <p className="text-sm text-on-surface-variant">Purchased: {purchaseDate}</p>
                <p className="text-sm text-on-surface-variant font-medium">
                    Expires: {expiresAt} ({daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"})
                </p>
            </div>
        </Card>
    );
};

interface WarrantiesScreenProps {
    userRole: UserRole;
    onUpgrade: () => void;
}

const WarrantiesScreen: React.FC<WarrantiesScreenProps> = ({ userRole, onUpgrade }) => {
    if (userRole === "FREE") {
        return (
            <div className="p-4 md:p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="bg-tertiary/20 p-3 rounded-full mb-4">
                    <AlertTriangleIcon className="w-8 h-8 text-tertiary" />
                </div>
                <h2 className="text-2xl font-medium text-on-surface mb-2">Never Lose a Warranty Again</h2>
                <p className="text-on-surface-variant max-w-md mb-6">
                    Upgrade to Premium to automatically track warranties from your invoices and get reminders before
                    they expire.
                </p>
                <Button onClick={onUpgrade}>Upgrade to Premium</Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-normal text-on-surface">Product Warranties</h1>
                    <p className="text-base text-on-surface-variant">
                        Keep track of all your product warranties in one place.
                    </p>
                </div>
                <Button leftIcon={<PlusIcon className="w-5 h-5" />}>Add Manually</Button>
            </header>
            <main>
                {MOCK_WARRANTIES.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MOCK_WARRANTIES.map((warranty) => (
                            <WarrantyCard key={warranty.id} warranty={warranty} />
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 mt-4 text-center flex flex-col items-center">
                        <div className="p-3 bg-primary-container rounded-full mb-4">
                            <ShieldCheckIcon className="w-8 h-8 text-on-primary-container" />
                        </div>
                        <h3 className="text-xl font-medium text-on-surface">No Warranties to Show</h3>
                        <p className="text-on-surface-variant mt-1 mb-6 max-w-sm">
                            Warranties from your uploaded invoices will appear here, or you can add one manually using
                            the button above.
                        </p>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default WarrantiesScreen;
