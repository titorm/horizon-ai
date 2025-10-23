import React from 'react';

export type Screen = 
  | 'landing'
  | 'login'
  | 'register'
  | 'welcome'
  | 'onboarding/select-bank'
  | 'onboarding/security'
  | 'onboarding/loading'
  | 'dashboard/overview'
  | 'dashboard/accounts'
  | 'dashboard/transactions'
  | 'dashboard/categories'
  | 'dashboard/invoices'
  | 'dashboard/warranties'
  | 'dashboard/taxes'
  | 'dashboard/notifications'
  | 'dashboard/settings'
  | 'dashboard/help'
  | 'dashboard/pricing'
  | 'dashboard/succession'
  | 'dashboard/insurance'
  | 'dashboard/credit'
  | 'dashboard/integrations'
  | 'dashboard/planning-goals'
  | 'dashboard/analytics'
  | 'dashboard/family'
  | 'dashboard/shopping-list'
  | 'dashboard/compliance';


export type ToastType = 'success' | 'error';

export interface Bank {
  id: string;
  name: string;
  logo: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type AccountStatus = 'Connected' | 'Sync Error' | 'Disconnected' | 'Manual';
export type AccountType = 'checking' | 'savings' | 'investment' | 'other';

export interface CreditCard {
  $id: string;
  account_id: string;
  name: string;
  last_digits: string;
  credit_limit: number;
  used_limit: number;
  closing_day: number;
  due_day: number;
  brand?: 'visa' | 'mastercard' | 'elo' | 'amex' | 'other';
  data?: string; // JSON string with additional data
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Account {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  user_id: string;
  name: string;
  bank_id?: string; // Optional for manual accounts
  account_type: AccountType;
  last_digits?: string;
  balance: number;
  status: AccountStatus;
  last_sync?: string;
  is_manual: boolean;
  data?: string; // JSON string with additional data
  created_at: string;
  updated_at: string;
  creditCards?: CreditCard[];
}

export type TransactionType = 'credit' | 'debit' | 'pix' | 'boleto';

export interface Transaction {
  $id: string;
  description: string;
  amount: number;
  date: string;
  bankName: string;
  category: string;
  type: TransactionType;
  icon: React.FC<{className?: string}>;
  notes?: string;
  account_id?: string;
  credit_card_id?: string;
}

export type InvoiceStatus = 'COMPLETED' | 'PROCESSING' | 'FAILED';

export interface Invoice {
  $id: string;
  fileName: string;
  uploadDate: string;
  status: InvoiceStatus;
}

export type UserRole = 'FREE' | 'PREMIUM';

export interface User {
  $id?: string;
  name: string;
  role: UserRole;
  email?: string;
}


export interface Category {
    $id: string;
    name: string;
    percentage?: number;
    transactionCount?: number;
    icon: React.FC<{className?: string}>;
}

export interface Notification {
    $id: string;
    title: 'Warranty Expiring Soon' | 'Large Purchase Alert' | 'Weekly Summary Ready';
    description: string;
    date: string;
    read: boolean;
}

export interface Warranty {
    $id: string;
    productName: string;
    purchaseDate: string;
    expiresAt: string;
    daysRemaining: number;
}

export type TaxSectionStatus = 'COMPLETED' | 'NEEDS_REVIEW' | 'NOT_STARTED';

export interface TaxSection {
    $id: string;
    title: string;
    status: TaxSectionStatus;
}

export interface TaxAsset {
  $id: string;
  groupCode: string;
  groupName: string;
  itemCode: string;
  itemName: string;
  location: 'Brasil' | 'Exterior';
  description: string;
  value2023: number;
  value2024: number;
}

export interface TaxIncome {
  $id: string;
  type: 'EXEMPT' | 'EXCLUSIVE';
  code: string;
  description: string;
  value: number;
  sourceName: string;
  sourceCnpj: string;
}


// Phase 4 Types
export interface Beneficiary {
  $id: string;
  name: string;
  relationship: string;
  allocation: string;
  status: 'Confirmed' | 'Pending';
}

export interface InsurancePolicy {
  $id: string;
  type: 'Life' | 'Home' | 'Auto';
  provider: string;
  coverage: number;
  premium: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export type IntegrationCategory = 'Investments' | 'E-commerce' | 'Real Estate' | 'Rewards';

export interface Integration {
  name: string;
  description: string;
  logo: React.FC<{className?: string}>;
  connected: boolean;
  category: IntegrationCategory;
}

export interface FinancialGoal {
  $id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface SuggestedGoal {
  name: string;
  targetAmount: number;
  targetDate: string;
  justification: string;
}


export interface FamilyMember {
  $id: string;
  name: string;
  role: 'Admin' | 'Member' | 'Child';
}

export type InsightType = 'SAVINGS_OPPORTUNITY' | 'UNUSUAL_SPENDING' | 'CASH_FLOW_FORECAST';

export interface FinancialInsight {
  $id: string;
  type: InsightType;
  title: string;
  description: string;
  actionText: string;
}

export interface ShoppingListItem {
    $id: string;
    name: string;
    checked: boolean;
}

export interface ShoppingList {
    $id: string;
    title: string;
    createdAt: string;
    items: ShoppingListItem[];
}

export interface PurchasedItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  brand?: string;
}

export interface PurchaseRecord {
  $id: string;
  storeName: string;
  purchaseDate: string;
  items: PurchasedItem[];
  totalAmount: number;
  nfeUrl?: string;
}
