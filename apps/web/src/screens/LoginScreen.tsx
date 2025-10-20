import React from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { ArrowLeftIcon } from "../assets/Icons";

interface LoginScreenProps {
    onLogin: () => void;
    onBack: () => void;
    onGoToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack, onGoToRegister }) => {
    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-4">
                    <Button variant="outlined" onClick={onBack} className="border-none !px-2">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Home
                    </Button>
                </div>
                <Card className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-medium text-on-surface">Welcome back</h1>
                        <p className="text-on-surface-variant">Sign in to continue to Horizon AI.</p>
                    </div>
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onLogin();
                        }}
                    >
                        <Input id="email" label="Email Address" type="email" placeholder="you@example.com" required />
                        <Input id="password" label="Password" type="password" required />
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                    <p className="text-center text-sm text-on-surface-variant mt-6">
                        Don't have an account?{" "}
                        <button onClick={onGoToRegister} className="font-medium text-primary hover:underline">
                            Sign up
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default LoginScreen;
