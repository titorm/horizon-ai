import React, { useState, useEffect } from "react";
import Spinner from "../components/ui/Spinner";

const messages = [
    "Connecting securely...",
    "Authenticating with your bank...",
    "Syncing your accounts...",
    "Analyzing transactions...",
    "Almost there...",
];

const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <Spinner />
            <p className="mt-6 text-base text-on-surface-variant transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};

export default LoadingScreen;
