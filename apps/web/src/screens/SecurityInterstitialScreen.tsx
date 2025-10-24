import React from "react";
import Button from "@/components/ui/Button";
import { LockIcon } from "@/components/assets/Icons";

interface SecurityInterstitialScreenProps {
    bankName: string;
    onContinue: () => void;
    onBack: () => void;
}

const SecurityInterstitialScreen: React.FC<SecurityInterstitialScreenProps> = ({ bankName, onContinue, onBack }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <div className="bg-primary-container p-4 rounded-full mb-6">
                <LockIcon className="w-8 h-8 text-on-primary-container" />
            </div>
            <h1 className="text-2xl md:text-3xl font-normal text-on-surface mb-4 max-w-md">
                You will be securely directed to {bankName}
            </h1>
            <p className="text-base text-on-surface-variant max-w-sm mb-12">
                To authorize the connection, you will need to log in to your bank's portal.
                <br />
                <strong className="text-on-surface">Horizon AI never sees your password.</strong>
            </p>
            <div className="w-full max-w-xs space-y-3">
                <Button onClick={onContinue} className="w-full">
                    Continue
                </Button>
                <Button onClick={onBack} variant="outlined" className="w-full">
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default SecurityInterstitialScreen;
