import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { ArrowLeftIcon } from "../assets/Icons";

interface RegisterScreenProps {
    onRegister: (email: string, password: string, firstName: string, lastName?: string) => void;
    onBack: () => void;
    onGoToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onBack, onGoToLogin }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");

    const validatePassword = (pwd: string) => {
        if (pwd.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        }
        if (!/(?=.*[a-z])/.test(pwd)) {
            setPasswordError("Password must contain at least one lowercase letter");
            return false;
        }
        if (!/(?=.*[A-Z])/.test(pwd)) {
            setPasswordError("Password must contain at least one uppercase letter");
            return false;
        }
        if (!/(?=.*\d)/.test(pwd)) {
            setPasswordError("Password must contain at least one number");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword.length > 0) {
            validatePassword(newPassword);
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validatePassword(password)) {
            onRegister(email, password, firstName, lastName);
        }
    };

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
                        <h1 className="text-2xl font-medium text-on-surface">Create your account</h1>
                        <p className="text-on-surface-variant">Start your journey to financial clarity.</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input 
                            id="firstName" 
                            label="First Name" 
                            type="text" 
                            placeholder="Mariana" 
                            required 
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <Input 
                            id="lastName" 
                            label="Last Name" 
                            type="text" 
                            placeholder="Silva" 
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                        <Input 
                            id="email" 
                            label="Email Address" 
                            type="email" 
                            placeholder="you@example.com" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div>
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Min. 8 characters"
                                required
                                minLength={8}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && (
                                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                            )}
                            <p className="text-xs text-on-surface-variant mt-1">
                                Must contain uppercase, lowercase, and number
                            </p>
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>
                    <p className="text-center text-sm text-on-surface-variant mt-6">
                        Already have an account?{" "}
                        <button onClick={onGoToLogin} className="font-medium text-primary hover:underline">
                            Sign in
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default RegisterScreen;
