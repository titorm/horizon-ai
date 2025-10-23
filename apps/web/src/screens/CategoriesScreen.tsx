import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { MOCK_CATEGORIES } from "../constants";
import type { Category } from "../types";
import Button from "@/components/ui/Button";
import { SettingsIcon } from "../assets/Icons";
import ManageCategoriesModal from "./ManageCategoriesModal";

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => {
    const { icon: Icon, name, percentage, transactionCount } = category;
    return (
        <div className="flex items-center gap-4 py-3">
            <div className="p-2 bg-primary-container rounded-full">
                <Icon className="w-6 h-6 text-on-primary-container" />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-on-surface">{name}</p>
                    {percentage !== undefined && (
                        <p className="text-sm font-medium text-on-surface-variant">{percentage}%</p>
                    )}
                </div>
                {percentage !== undefined && percentage > 0 && (
                    <div className="w-full bg-surface-variant rounded-full h-2">
                        <div className="bg-primary rounded-full h-2" style={{ width: `${percentage}%` }}></div>
                    </div>
                )}
                {transactionCount !== undefined && (
                    <p className="text-xs text-on-surface-variant mt-1">{transactionCount} transactions</p>
                )}
            </div>
        </div>
    );
};

const CategoriesScreen: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddCategory = (name: string, icon: React.FC<{ className?: string }>) => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name,
            icon,
            transactionCount: 0,
            percentage: 0,
        };
        setCategories((prev) => [...prev, newCategory]);
    };

    const handleUpdateCategory = (updatedCategory: Category) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === updatedCategory.id ? { ...c, name: updatedCategory.name, icon: updatedCategory.icon } : c
            )
        );
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    };

    return (
        <>
            <div className="p-4 md:p-8">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-normal text-on-surface">Transaction Categories</h1>
                        <p className="text-base text-on-surface-variant">Understand where your money is going.</p>
                    </div>
                    <Button
                        variant="outlined"
                        leftIcon={<SettingsIcon className="w-5 h-5" />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Manage Categories
                    </Button>
                </header>
                <main>
                    <Card className="p-6">
                        <h2 className="text-xl font-medium text-on-surface mb-2">Spending Breakdown</h2>
                        <p className="text-sm text-on-surface-variant mb-4">
                            92% of transactions auto-categorized this month.
                        </p>
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <CategoryItem key={category.id} category={category} />
                            ))}
                        </div>
                    </Card>
                </main>
            </div>
            <ManageCategoriesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        </>
    );
};

export default CategoriesScreen;
