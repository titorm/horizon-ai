'use client';

import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, XIcon } from "@/components/assets/Icons";

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    const baseClasses =
        "fixed top-5 right-5 flex items-center p-4 rounded-m shadow-lg transition-all duration-300 ease-in-out transform";

    const typeClasses = {
        success: "bg-secondary text-on-secondary",
        error: "bg-error text-on-error",
    };

    const icon = {
        success: <CheckCircleIcon className="w-6 h-6" />,
        error: <XCircleIcon className="w-6 h-6" />,
    };

    const visibilityClass = visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0";

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClass}`} role="alert">
            <div className="mr-3">{icon[type]}</div>
            <p className="font-medium text-sm">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full hover:bg-white/20 inline-flex h-8 w-8"
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <XIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Toast;
