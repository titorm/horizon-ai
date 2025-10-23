import React from "react";
import Button from "@/components/ui/Button";

interface WelcomeScreenProps {
    onConnect: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onConnect }) => {
    return (
        <main className="flex flex-col h-screen p-6 md:p-12">
            <div className="flex-grow flex flex-col justify-center max-w-2xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-normal text-on-surface mb-4">
                    The complete picture of your finances.
                </h1>
                <p className="text-base font-normal text-on-surface-variant max-w-md mx-auto">
                    Connect your accounts in seconds with Open Finance to see everything in one place. Securely and
                    automatically.
                </p>
            </div>
            <div className="pb-8">
                <Button onClick={onConnect} className="w-full max-w-sm mx-auto">
                    Connect my first account
                </Button>
            </div>
        </main>
    );
};

export default WelcomeScreen;
