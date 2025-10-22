import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";

interface SettingsScreenProps {
    onShowToast: (message: string, type: "success" | "error") => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onShowToast }) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, message: string) => {
        event.preventDefault();
        onShowToast(message, "success");
    };

    return (
        <div className="p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-normal text-on-surface">Settings</h1>
                <p className="text-base text-on-surface-variant">Manage your account and preferences.</p>
            </header>

            <Card className="p-6">
                <Tabs defaultValue="account">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    </TabsList>

                    <TabsContent value="account">
                        <form
                            className="space-y-4 max-w-md"
                            onSubmit={(e) => handleSubmit(e, "Account information saved!")}
                        >
                            <h3 className="text-lg font-medium">Profile Information</h3>
                            <Input id="firstName" label="First Name" defaultValue="Mariana" />
                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                defaultValue="mariana@example.com"
                                readOnly
                            />
                            <Button type="submit">Save Changes</Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="security">
                        <form
                            className="space-y-4 max-w-md"
                            onSubmit={(e) => handleSubmit(e, "Password updated successfully!")}
                        >
                            <h3 className="text-lg font-medium">Change Password</h3>
                            <Input id="currentPassword" label="Current Password" type="password" />
                            <Input id="newPassword" label="New Password" type="password" />
                            <Input id="confirmPassword" label="Confirm New Password" type="password" />
                            <Button type="submit">Update Password</Button>
                        </form>
                        <hr className="my-6 border-outline" />
                        <div>
                            <h3 className="text-lg font-medium">Account Actions</h3>
                            <p className="text-sm text-on-surface-variant mt-1 mb-4">
                                Permanently delete your account and all associated data.
                            </p>
                            <Button className="bg-error hover:bg-error/90">Delete Account</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <form
                            className="space-y-4 max-w-md"
                            onSubmit={(e) => handleSubmit(e, "Notification preferences saved!")}
                        >
                            <h3 className="text-lg font-medium">Email Notifications</h3>
                            <div className="flex items-center justify-between p-3 bg-surface-variant/20 rounded-m">
                                <label htmlFor="weekly-summary" className="font-medium">
                                    Weekly Summary
                                </label>
                                <input type="checkbox" id="weekly-summary" className="toggle" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-surface-variant/20 rounded-m">
                                <label htmlFor="large-purchase" className="font-medium">
                                    Large Purchase Alerts
                                </label>
                                <input type="checkbox" id="large-purchase" className="toggle" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-surface-variant/20 rounded-m">
                                <label htmlFor="warranty-reminder" className="font-medium">
                                    Warranty Expiration Reminders
                                </label>
                                <input type="checkbox" id="warranty-reminder" className="toggle" defaultChecked />
                            </div>
                            <Button type="submit">Save Preferences</Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="preferences">
                        <form className="space-y-6 max-w-md" onSubmit={(e) => handleSubmit(e, "Preferences saved!")}>
                            <div>
                                <h3 className="text-lg font-medium">Display Preferences</h3>
                                <div className="space-y-4 mt-2">
                                    <div>
                                        <label
                                            htmlFor="currency"
                                            className="block text-sm font-medium text-on-surface-variant mb-1"
                                        >
                                            Currency
                                        </label>
                                        <select
                                            id="currency"
                                            name="currency"
                                            className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="BRL">Brazilian Real (BRL)</option>
                                            <option value="USD">United States Dollar (USD)</option>
                                            <option value="EUR">Euro (EUR)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                                            Appearance
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="theme" value="light" defaultChecked /> Light
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="theme" value="dark" /> Dark
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="theme" value="system" /> System
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">App Behavior</h3>
                                <div className="space-y-4 mt-2">
                                    <div>
                                        <label
                                            htmlFor="startScreen"
                                            className="block text-sm font-medium text-on-surface-variant mb-1"
                                        >
                                            Default Start Screen
                                        </label>
                                        <select
                                            id="startScreen"
                                            name="startScreen"
                                            className="w-full h-12 px-3 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="overview">Overview</option>
                                            <option value="transactions">Transactions</option>
                                            <option value="accounts">Accounts</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <Button type="submit">Save Preferences</Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};

export default SettingsScreen;
