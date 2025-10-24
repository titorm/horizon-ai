/**
 * Application Constants
 * 
 * This file contains all constant values used throughout the application,
 * migrated from apps/web/src/constants.ts
 */

import type {
  Bank,
  User,
  Transaction,
  Category,
  Invoice,
  Notification,
  Warranty,
  TaxSection,
  TaxAsset,
  TaxIncome,
  FinancialInsight,
  Integration,
  ShoppingList,
  PurchaseRecord,
  Beneficiary,
  InsurancePolicy,
  FinancialGoal,
  FamilyMember,
  MonthlyChartData,
  CategoryIcon,
  RetirementGoal,
} from './types';

// Note: Icon and Logo imports will need to be updated once components are migrated
// For now, these are placeholder references

// ============================================
// Bank Configuration
// ============================================

export const BANKS: Bank[] = [
  { id: 'itau', name: 'Itaú Unibanco', logo: null as any }, // Will be: ItauLogo
  { id: 'nubank', name: 'Nubank', logo: null as any }, // Will be: NubankLogo
  { id: 'bradesco', name: 'Bradesco', logo: null as any }, // Will be: BradescoLogo
  { id: 'santander', name: 'Santander', logo: null as any }, // Will be: SantanderLogo
  { id: 'inter', name: 'Banco Inter', logo: null as any }, // Will be: InterLogo
  { id: 'bb', name: 'Banco do Brasil', logo: null as any }, // Will be: BbLogo
];

// ============================================
// Mock Data (for development/testing)
// ============================================

export const MOCK_BALANCE = 24538.54;

export const MOCK_USER: User = {
  $id: 'mock-user-1',
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  auth_user_id: 'mock-auth-1',
  email: 'mariana@example.com',
  name: 'Mariana',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_MONTHLY_INCOME = 8500.0;
export const MOCK_MONTHLY_EXPENSES = -3245.7;

export const MOCK_CHART_DATA: MonthlyChartData[] = [
  { month: 'Mar', income: 8200, expenses: 4100 },
  { month: 'Apr', income: 8500, expenses: 3800 },
  { month: 'May', income: 8700, expenses: 4500 },
  { month: 'Jun', income: 8500, expenses: 4850 },
  { month: 'Jul', income: 9100, expenses: 5200 },
  { month: 'Aug', income: 8500, expenses: 3245 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    $id: '1',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    user_id: 'mock-user-1',
    description: 'iFood',
    amount: -45.9,
    date: new Date().toISOString(),
    bankName: 'Nubank',
    category: 'Food & Dining',
    type: 'expense',
    status: 'completed',
    notes: 'Dinner with friends at the new pizza place.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    $id: '2',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    user_id: 'mock-user-1',
    description: 'Uber',
    amount: -22.5,
    date: new Date().toISOString(),
    bankName: 'Itaú',
    category: 'Transport',
    type: 'expense',
    status: 'completed',
    notes: 'Trip to the office for the quarterly meeting.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    $id: '3',
    $createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    $updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'mock-user-1',
    description: 'Salary',
    amount: 8500.0,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    bankName: 'Itaú',
    category: 'Income',
    type: 'income',
    status: 'completed',
    notes: 'Monthly salary deposit.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: '4',
    $createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    $updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'mock-user-1',
    description: 'Renner',
    amount: -350.0,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    bankName: 'Nubank',
    category: 'Shopping',
    type: 'expense',
    status: 'completed',
    notes: 'New clothes for the trip.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: '5',
    $createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    $updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'mock-user-1',
    description: 'Netflix',
    amount: -39.9,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    bankName: 'Nubank',
    category: 'Entertainment',
    type: 'expense',
    status: 'completed',
    notes: 'Monthly subscription fee.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: '6',
    $createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    $updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'mock-user-1',
    description: 'Pão de Açúcar',
    amount: -412.8,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    bankName: 'Itaú',
    category: 'Groceries',
    type: 'expense',
    status: 'completed',
    notes: 'Weekly grocery shopping.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: '7',
    $createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    $updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'mock-user-1',
    description: 'Gym Membership',
    amount: -120.0,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    bankName: 'Nubank',
    category: 'Health & Wellness',
    type: 'expense',
    status: 'completed',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: '8',
    $createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    $updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'mock-user-1',
    description: 'Flight to Rio',
    amount: -850.0,
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    bankName: 'Itaú',
    category: 'Travel',
    type: 'expense',
    status: 'completed',
    notes: 'Round trip ticket for vacation.',
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { $id: 'cat-1', name: 'Shopping', percentage: 35, transactionCount: 12, icon: null as any },
  { $id: 'cat-2', name: 'Food & Dining', percentage: 25, transactionCount: 28, icon: null as any },
  { $id: 'cat-3', name: 'Transport', percentage: 15, transactionCount: 15, icon: null as any },
  { $id: 'cat-4', name: 'Health & Wellness', percentage: 10, transactionCount: 5, icon: null as any },
  { $id: 'cat-5', name: 'Travel', percentage: 8, transactionCount: 2, icon: null as any },
  { $id: 'cat-6', name: 'Work', percentage: 7, transactionCount: 4, icon: null as any },
];

export const AVAILABLE_CATEGORY_ICONS: CategoryIcon[] = [
  { name: 'Balance', component: null as any },
  { name: 'Shopping', component: null as any },
  { name: 'Dining', component: null as any },
  { name: 'Transport', component: null as any },
  { name: 'Health', component: null as any },
  { name: 'Travel', component: null as any },
  { name: 'Work', component: null as any },
  { name: 'Home', component: null as any },
  { name: 'Gifts', component: null as any },
  { name: 'Bills', component: null as any },
  { name: 'Investments', component: null as any },
  { name: 'Family', component: null as any },
  { name: 'Other', component: null as any },
];

export const MOCK_INVOICES: Invoice[] = [
  { $id: '1', fileName: 'apple-macbook-pro.pdf', uploadDate: 'Oct 20, 2023', status: 'COMPLETED' },
  { $id: '2', fileName: 'fast-shop-tv.xml', uploadDate: 'Oct 19, 2023', status: 'COMPLETED' },
  { $id: '3', fileName: 'invoice-09-2023.jpg', uploadDate: 'Oct 18, 2023', status: 'PROCESSING' },
  { $id: '4', fileName: 'scan-001.png', uploadDate: 'Oct 17, 2023', status: 'FAILED' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    $id: '1',
    title: 'Warranty Expiring Soon',
    description: 'Your MacBook Pro warranty expires in 30 days. Consider an extension.',
    date: '2h ago',
    read: false,
  },
  {
    $id: '2',
    title: 'Large Purchase Alert',
    description: 'A purchase of R$ 4,500.00 was made at Fast Shop.',
    date: '1d ago',
    read: false,
  },
  {
    $id: '3',
    title: 'Weekly Summary Ready',
    description: 'Your financial summary for Oct 22-28 is ready to view.',
    date: '2d ago',
    read: true,
  },
];

export const MOCK_WARRANTIES: Warranty[] = [
  {
    $id: '1',
    productName: 'MacBook Pro 14"',
    purchaseDate: 'Oct 20, 2022',
    expiresAt: 'Oct 19, 2023',
    daysRemaining: 20,
  },
  {
    $id: '2',
    productName: 'Samsung 65" TV',
    purchaseDate: 'Sep 15, 2022',
    expiresAt: 'Sep 14, 2023',
    daysRemaining: 80,
  },
  {
    $id: '3',
    productName: 'iPhone 15 Pro',
    purchaseDate: 'Sep 30, 2023',
    expiresAt: 'Sep 29, 2024',
    daysRemaining: 335,
  },
  {
    $id: '4',
    productName: 'AirPods Pro',
    purchaseDate: 'Jan 05, 2022',
    expiresAt: 'Jan 04, 2023',
    daysRemaining: -200,
  },
];

export const MOCK_TAX_SECTIONS: TaxSection[] = [
  { $id: '1', title: 'Income from Employment', status: 'COMPLETED' },
  { $id: '2', title: 'Investment Gains (Stocks, FIIs)', status: 'NEEDS_REVIEW' },
  { $id: '3', title: 'Rental Income', status: 'NOT_STARTED' },
  { $id: '4', title: 'Deductible Expenses (Health, Education)', status: 'COMPLETED' },
];

export const MOCK_RETIREMENT_GOAL: RetirementGoal = {
  targetAge: 65,
  targetSavings: 2000000,
  currentSavings: 450000,
  monthlyContribution: 1500,
};

export const MOCK_TAX_ASSETS: TaxAsset[] = [
  {
    $id: '1',
    groupCode: '04',
    groupName: 'Aplicações e Investimentos',
    itemCode: '01',
    itemName: 'Depósito em conta poupança',
    location: 'Brasil',
    description: 'Conta Poupança no Itaú Unibanco, Ag 9999 C/C 99999-9',
    value2023: 23.83,
    value2024: 10.0,
  },
  {
    $id: '2',
    groupCode: '07',
    groupName: 'Fundos',
    itemCode: '01',
    itemName: 'Fundos de Investimento sujeitos à tributação periódica (come-cotas)',
    location: 'Brasil',
    description: 'ITAU PERSONNALITE FICFI MM CHRONOS FICFI MM, CNPJ do Fundo: 12.345.678/9123-99',
    value2023: 473441.57,
    value2024: 150613.17,
  },
  {
    $id: '3',
    groupCode: '04',
    groupName: 'Aplicações e Investimentos',
    itemCode: '02',
    itemName: 'Títulos públicos e privados sujeitos à tributação (Tesouro Direto, CDB, RDB e Outros)',
    location: 'Brasil',
    description: 'CDB DI no banco Itaú Unibanco SA',
    value2023: 473441.57,
    value2024: 150613.17,
  },
];

export const MOCK_TAX_INCOMES: TaxIncome[] = [
  {
    $id: '1',
    type: 'EXEMPT',
    code: '12',
    description:
      'Rendimentos de cadernetas de poupança, letras hipotecárias, letras de crédito do agronegócio e imobiliário (LCA e LCI) e certificados de recebíveis do agronegócio e imobiliários (CRA e CRI)',
    value: 15239.9,
    sourceName: 'Itaú Unibanco SA',
    sourceCnpj: '60.701.190/0001-04',
  },
  {
    $id: '2',
    type: 'EXCLUSIVE',
    code: '06',
    description: 'Rendimentos de aplicações financeiras',
    value: 15165.82,
    sourceName: 'Itaú Unibanco SA',
    sourceCnpj: '60.701.190/0001-04',
  },
];

export const MOCK_INSIGHTS: FinancialInsight[] = [
  {
    $id: '1',
    type: 'SAVINGS_OPPORTUNITY',
    title: 'Save R$ 480/year on Subscriptions',
    description:
      'We noticed you have multiple streaming subscriptions. Consolidating or switching to an annual plan could lead to significant savings.',
    actionText: 'Review Subscriptions',
  },
  {
    $id: '2',
    type: 'UNUSUAL_SPENDING',
    title: 'Higher than usual spending in "Food & Dining"',
    description:
      'Your spending in this category is up 45% this month compared to your 6-month average. Keeping an eye on this can help you stay on budget.',
    actionText: 'View Transactions',
  },
  {
    $id: '3',
    type: 'CASH_FLOW_FORECAST',
    title: 'Positive Cash Flow Forecast',
    description:
      'Based on your income and typical spending, you're on track to have a surplus of ~R$ 3,200 this month. A great opportunity to save or invest!',
    actionText: 'Set a Goal',
  },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  // Investments
  {
    name: 'XP Investimentos',
    description: 'Sync your stock and fund portfolios.',
    logo: null as any,
    connected: false,
    category: 'Investments',
  },
  {
    name: 'B3',
    description: 'Import your official stock exchange data.',
    logo: null as any,
    connected: true,
    category: 'Investments',
  },
  {
    name: 'BTG Pactual',
    description: 'Connect your investment and banking accounts.',
    logo: null as any,
    connected: false,
    category: 'Investments',
  },
  {
    name: 'Clear Corretora',
    description: 'Sync your trading and investment data.',
    logo: null as any,
    connected: false,
    category: 'Investments',
  },
  // E-commerce
  {
    name: 'Mercado Livre',
    description: 'Sync purchases and track spending.',
    logo: null as any,
    connected: true,
    category: 'E-commerce',
  },
  {
    name: 'Magazine Luiza',
    description: 'Import receipts and track warranties.',
    logo: null as any,
    connected: false,
    category: 'E-commerce',
  },
  {
    name: 'Amazon Brasil',
    description: 'Consolidate your purchase history.',
    logo: null as any,
    connected: false,
    category: 'E-commerce',
  },
  // Real Estate
  {
    name: 'QuintoAndar',
    description: 'Track your rental income automatically.',
    logo: null as any,
    connected: false,
    category: 'Real Estate',
  },
  {
    name: 'Zap Imóveis',
    description: 'Monitor the value of your real estate assets.',
    logo: null as any,
    connected: false,
    category: 'Real Estate',
  },
  {
    name: 'Loft',
    description: 'Keep track of property values and financing.',
    logo: null as any,
    connected: false,
    category: 'Real Estate',
  },
  // Rewards
  {
    name: 'Livelo',
    description: 'Track your points balance and statements.',
    logo: null as any,
    connected: true,
    category: 'Rewards',
  },
  {
    name: 'Smiles',
    description: 'Monitor your miles and loyalty status.',
    logo: null as any,
    connected: false,
    category: 'Rewards',
  },
];

export const MOCK_SHOPPING_LISTS: ShoppingList[] = [
  {
    $id: '1',
    title: 'Weekly Groceries',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { $id: '1-1', name: 'Milk', checked: true },
      { $id: '1-2', name: 'Bread', checked: true },
      { $id: '1-3', name: 'Eggs (dozen)', checked: true },
      { $id: '1-4', name: 'Chicken breast (1kg)', checked: false },
      { $id: '1-5', name: 'Rice (2kg)', checked: true },
      { $id: '1-6', name: 'Beans (1kg)', checked: true },
    ],
  },
  {
    $id: '2',
    title: 'Barbecue for friends',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { $id: '2-1', name: 'Picanha (2kg)', checked: true },
      { $id: '2-2', name: 'Sausage (1kg)', checked: true },
      { $id: '2-3', name: 'Garlic bread', checked: true },
      { $id: '2-4', name: 'Charcoal', checked: true },
      { $id: '2-5', name: 'Beer (2 packs)', checked: true },
    ],
  },
];

// export const MOCK_PURCHASE_HISTORY: PurchaseRecord[] = [
//     {
//         $id: "pr-1",
//         storeName: "Pão de Açúcar",
//         purchaseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
//         totalAmount: 412.8,
//         nfeUrl: "http://example.com/nfe1",
//         items: [
//             { name: "Leite Integral Qualitá", brand: "Qualitá", quantity: 12, unitPrice: 4.5, totalPrice: 54.0 },
//             { name: "Pão de Forma Pullman", brand: "Pullman", quantity: 2, unitPrice: 8.0, totalPrice: 16.0 },
//             { name: "Café em Pó 3 Corações", brand: "3 Corações", quantity: 1, unitPrice: 18.5, totalPrice: 18.5 },
//             { name: "Contra Filé Friboi (kg)", brand: "Friboi", quantity: 1.5, unitPrice: 55.0, totalPrice: 82.5 },
//         ],
//     },
// ];

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  { $id: '1', name: 'Carlos Silva', relationship: 'Spouse', allocation: '50% of investments', status: 'Confirmed' },
  { $id: '2', name: 'Joana Silva', relationship: 'Daughter', allocation: '25% of investments', status: 'Confirmed' },
  { $id: '3', name: 'Pedro Silva', relationship: 'Son', allocation: '25% of investments', status: 'Pending' },
];

export const MOCK_INSURANCE_POLICIES: InsurancePolicy[] = [
  { $id: '1', type: 'Life', provider: 'Seguradora XYZ', coverage: 1000000, premium: 99, status: 'Active' },
  { $id: '2', type: 'Home', provider: 'Porto Seguro', coverage: 800000, premium: 250, status: 'Active' },
  { $id: '3', type: 'Auto', provider: 'Tokio Marine', coverage: 50000, premium: 180, status: 'Expiring Soon' },
];

export const MOCK_FINANCIAL_GOALS: FinancialGoal[] = [
  { $id: '1', name: 'Buy a house', targetAmount: 600000, currentAmount: 150000, targetDate: 'Dec 2027' },
  { $id: '2', name: 'Vacation', targetAmount: 30000, currentAmount: 28000, targetDate: 'Jun 2025' },
  { $id: '3', name: "Kids' Education", targetAmount: 200000, currentAmount: 45000, targetDate: "Aug 2028" },
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  { $id: '1', name: 'Mariana Silva', role: 'Admin' },
  { $id: '2', name: 'Carlos Silva', role: 'Member' },
  { $id: '3', name: 'Joana Silva', role: 'Child' },
];

// ============================================
// Application Configuration
// ============================================

/**
 * Default currency for the application
 */
export const DEFAULT_CURRENCY = 'BRL';

/**
 * Default locale for formatting
 */
export const DEFAULT_LOCALE = 'pt-BR';

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * Date format patterns
 */
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

/**
 * API configuration
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * File upload limits
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/xml',
  'text/xml',
];
