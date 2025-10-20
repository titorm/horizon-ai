
import {
  BbLogo,
  BradescoLogo,
  InterLogo,
  ItauLogo,
  NubankLogo,
  SantanderLogo
} from './src/assets/BankLogos';
import {
  BriefcaseIcon,
  CarIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  LandmarkIcon,
  PlaneIcon,
  ReceiptIcon,
  RepeatIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
  UtensilsIcon,
} from './src/assets/Icons';
import type {
  Bank,
  Beneficiary,
  Category,
  FamilyMember,
  FinancialGoal,
  FinancialInsight,
  InsurancePolicy,
  Integration,
  Invoice,
  Notification,
  PurchaseRecord,
  ShoppingList,
  TaxAsset,
  TaxIncome,
  TaxSection,
  Transaction,
  User,
  Warranty
} from './types';


export const BANKS: Bank[] = [
  { id: 'itau', name: 'Itaú Unibanco', logo: ItauLogo },
  { id: 'nubank', name: 'Nubank', logo: NubankLogo },
  { id: 'bradesco', name: 'Bradesco', logo: BradescoLogo },
  { id: 'santander', name: 'Santander', logo: SantanderLogo },
  { id: 'inter', name: 'Banco Inter', logo: InterLogo },
  { id: 'bb', name: 'Banco do Brasil', logo: BbLogo },
];

export const MOCK_BALANCE = 24538.54;
export const MOCK_USER: User = {
    name: "Mariana",
    role: 'PREMIUM', // or 'FREE'
};

export const MOCK_MONTHLY_INCOME = 8500.00;
export const MOCK_MONTHLY_EXPENSES = -3245.70;

export const MOCK_CHART_DATA = [
  { month: 'Mar', income: 8200, expenses: 4100 },
  { month: 'Apr', income: 8500, expenses: 3800 },
  { month: 'May', income: 8700, expenses: 4500 },
  { month: 'Jun', income: 8500, expenses: 4850 },
  { month: 'Jul', income: 9100, expenses: 5200 },
  { month: 'Aug', income: 8500, expenses: 3245 },
];


export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'iFood', amount: -45.90, date: new Date().toISOString(), bankName: 'Nubank', category: 'Food & Dining', type: 'credit', icon: UtensilsIcon, notes: 'Dinner with friends at the new pizza place.' },
  { id: '2', description: 'Uber', amount: -22.50, date: new Date().toISOString(), bankName: 'Itaú', category: 'Transport', type: 'credit', icon: CarIcon, notes: 'Trip to the office for the quarterly meeting.'},
  { id: '3', description: 'Salary', amount: 8500.00, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), bankName: 'Itaú', category: 'Income', type: 'pix', icon: BriefcaseIcon, notes: 'Monthly salary deposit.' },
  { id: '4', description: 'Renner', amount: -350.00, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), bankName: 'Nubank', category: 'Shopping', type: 'credit', icon: ShoppingCartIcon, notes: 'New clothes for the trip.' },
  { id: '5', description: 'Netflix', amount: -39.90, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), bankName: 'Nubank', category: 'Entertainment', type: 'debit', icon: ShoppingCartIcon, notes: 'Monthly subscription fee.'},
  { id: '6', description: 'Pão de Açúcar', amount: -412.80, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), bankName: 'Itaú', category: 'Groceries', type: 'debit', icon: ShoppingCartIcon, notes: 'Weekly grocery shopping.' },
  { id: '7', description: 'Gym Membership', amount: -120.00, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), bankName: 'Nubank', category: 'Health & Wellness', type: 'credit', icon: HeartIcon },
  { id: '8', description: 'Flight to Rio', amount: -850.00, date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), bankName: 'Itaú', category: 'Travel', type: 'boleto', icon: PlaneIcon, notes: 'Round trip ticket for vacation.' },
];

export const MOCK_CATEGORIES: Category[] = [
    { id: 'cat-1', name: 'Shopping', percentage: 35, transactionCount: 12, icon: ShoppingCartIcon },
    { id: 'cat-2', name: 'Food & Dining', percentage: 25, transactionCount: 28, icon: UtensilsIcon },
    { id: 'cat-3', name: 'Transport', percentage: 15, transactionCount: 15, icon: CarIcon },
    { id: 'cat-4', name: 'Health & Wellness', percentage: 10, transactionCount: 5, icon: HeartIcon },
    { id: 'cat-5', name: 'Travel', percentage: 8, transactionCount: 2, icon: PlaneIcon },
    { id: 'cat-6', name: 'Work', percentage: 7, transactionCount: 4, icon: BriefcaseIcon },
];

export const AVAILABLE_CATEGORY_ICONS: { name: string; component: React.FC<{className?: string}> }[] = [
    { name: 'Shopping', component: ShoppingCartIcon },
    { name: 'Dining', component: UtensilsIcon },
    { name: 'Transport', component: CarIcon },
    { name: 'Health', component: HeartIcon },
    { name: 'Travel', component: PlaneIcon },
    { name: 'Work', component: BriefcaseIcon },
    { name: 'Home', component: HomeIcon },
    { name: 'Gifts', component: GiftIcon },
    { name: 'Bills', component: ReceiptIcon },
    { name: 'Investments', component: LandmarkIcon },
    { name: 'Family', component: UsersIcon },
    { name: 'Other', component: SparklesIcon },
];


export const MOCK_INVOICES: Invoice[] = [
    { id: '1', fileName: 'apple-macbook-pro.pdf', uploadDate: 'Oct 20, 2023', status: 'COMPLETED' },
    { id: '2', fileName: 'fast-shop-tv.xml', uploadDate: 'Oct 19, 2023', status: 'COMPLETED' },
    { id: '3', fileName: 'invoice-09-2023.jpg', uploadDate: 'Oct 18, 2023', status: 'PROCESSING' },
    { id: '4', fileName: 'scan-001.png', uploadDate: 'Oct 17, 2023', status: 'FAILED' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', title: 'Warranty Expiring Soon', description: 'Your MacBook Pro warranty expires in 30 days. Consider an extension.', date: '2h ago', read: false },
    { id: '2', title: 'Large Purchase Alert', description: 'A purchase of R$ 4,500.00 was made at Fast Shop.', date: '1d ago', read: false },
    { id: '3', title: 'Weekly Summary Ready', description: 'Your financial summary for Oct 22-28 is ready to view.', date: '2d ago', read: true },
];

export const MOCK_WARRANTIES: Warranty[] = [
    { id: '1', productName: 'MacBook Pro 14"', purchaseDate: 'Oct 20, 2022', expiresAt: 'Oct 19, 2023', daysRemaining: 20 },
    { id: '2', productName: 'Samsung 65" TV', purchaseDate: 'Sep 15, 2022', expiresAt: 'Sep 14, 2023', daysRemaining: 80 },
    { id: '3', productName: 'iPhone 15 Pro', purchaseDate: 'Sep 30, 2023', expiresAt: 'Sep 29, 2024', daysRemaining: 335 },
    { id: '4', productName: 'AirPods Pro', purchaseDate: 'Jan 05, 2022', expiresAt: 'Jan 04, 2023', daysRemaining: -200 },
];

export const MOCK_TAX_SECTIONS: TaxSection[] = [
    { id: '1', title: 'Income from Employment', status: 'COMPLETED' },
    { id: '2', title: 'Investment Gains (Stocks, FIIs)', status: 'NEEDS_REVIEW' },
    { id: '3', title: 'Rental Income', status: 'NOT_STARTED' },
    { id: '4', title: 'Deductible Expenses (Health, Education)', status: 'COMPLETED' },
];

export const MOCK_RETIREMENT_GOAL = {
    targetAge: 65,
    targetSavings: 2000000,
    currentSavings: 450000,
    monthlyContribution: 1500,
};

export const MOCK_TAX_ASSETS: TaxAsset[] = [
  { id: '1', groupCode: '04', groupName: 'Aplicações e Investimentos', itemCode: '01', itemName: 'Depósito em conta poupança', location: 'Brasil', description: 'Conta Poupança no Itaú Unibanco, Ag 9999 C/C 99999-9', value2023: 23.83, value2024: 10.00 },
  { id: '2', groupCode: '07', groupName: 'Fundos', itemCode: '01', itemName: 'Fundos de Investimento sujeitos à tributação periódica (come-cotas)', location: 'Brasil', description: 'ITAU PERSONNALITE FICFI MM CHRONOS FICFI MM, CNPJ do Fundo: 12.345.678/9123-99', value2023: 473441.57, value2024: 150613.17 },
  { id: '3', groupCode: '04', groupName: 'Aplicações e Investimentos', itemCode: '02', itemName: 'Títulos públicos e privados sujeitos à tributação (Tesouro Direto, CDB, RDB e Outros)', location: 'Brasil', description: 'CDB DI no banco Itaú Unibanco SA', value2023: 473441.57, value2024: 150613.17 },
];

export const MOCK_TAX_INCOMES: TaxIncome[] = [
  { id: '1', type: 'EXEMPT', code: '12', description: 'Rendimentos de cadernetas de poupança, letras hipotecárias, letras de crédito do agronegócio e imobiliário (LCA e LCI) e certificados de recebíveis do agronegócio e imobiliários (CRA e CRI)', value: 15239.90, sourceName: 'Itaú Unibanco SA', sourceCnpj: '60.701.190/0001-04' },
  { id: '2', type: 'EXCLUSIVE', code: '06', description: 'Rendimentos de aplicações financeiras', value: 15165.82, sourceName: 'Itaú Unibanco SA', sourceCnpj: '60.701.190/0001-04' },
];


export const MOCK_INSIGHTS: FinancialInsight[] = [
  {
    id: '1',
    type: 'SAVINGS_OPPORTUNITY',
    title: 'Save R$ 480/year on Subscriptions',
    description: "We noticed you have multiple streaming subscriptions. Consolidating or switching to an annual plan could lead to significant savings.",
    actionText: "Review Subscriptions",
  },
  {
    id: '2',
    type: 'UNUSUAL_SPENDING',
    title: 'Higher than usual spending in "Food & Dining"',
    description: "Your spending in this category is up 45% this month compared to your 6-month average. Keeping an eye on this can help you stay on budget.",
    actionText: "View Transactions",
  },
  {
    id: '3',
    type: 'CASH_FLOW_FORECAST',
    title: 'Positive Cash Flow Forecast',
    description: "Based on your income and typical spending, you're on track to have a surplus of ~R$ 3,200 this month. A great opportunity to save or invest!",
    actionText: "Set a Goal",
  }
];

export const MOCK_INTEGRATIONS: Integration[] = [
    // Investments
    { name: 'XP Investimentos', description: 'Sync your stock and fund portfolios.', logo: LandmarkIcon, connected: false, category: 'Investments' },
    { name: 'B3', description: 'Import your official stock exchange data.', logo: LandmarkIcon, connected: true, category: 'Investments' },
    { name: 'BTG Pactual', description: 'Connect your investment and banking accounts.', logo: LandmarkIcon, connected: false, category: 'Investments' },
    { name: 'Clear Corretora', description: 'Sync your trading and investment data.', logo: LandmarkIcon, connected: false, category: 'Investments' },
    // E-commerce
    { name: 'Mercado Livre', description: 'Sync purchases and track spending.', logo: ShoppingCartIcon, connected: true, category: 'E-commerce' },
    { name: 'Magazine Luiza', description: 'Import receipts and track warranties.', logo: ShoppingCartIcon, connected: false, category: 'E-commerce' },
    { name: 'Amazon Brasil', description: 'Consolidate your purchase history.', logo: ShoppingCartIcon, connected: false, category: 'E-commerce' },
    // Real Estate
    { name: 'QuintoAndar', description: 'Track your rental income automatically.', logo: HomeIcon, connected: false, category: 'Real Estate' },
    { name: 'Zap Imóveis', description: 'Monitor the value of your real estate assets.', logo: HomeIcon, connected: false, category: 'Real Estate' },
    { name: 'Loft', description: 'Keep track of property values and financing.', logo: HomeIcon, connected: false, category: 'Real Estate' },
    // Rewards
    { name: 'Livelo', description: 'Track your points balance and statements.', logo: GiftIcon, connected: true, category: 'Rewards' },
    { name: 'Smiles', description: 'Monitor your miles and loyalty status.', logo: GiftIcon, connected: false, category: 'Rewards' },
];

export const MOCK_SHOPPING_LISTS: ShoppingList[] = [
    {
        id: '1',
        title: 'Weekly Groceries',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
            { id: '1-1', name: 'Milk', checked: true },
            { id: '1-2', name: 'Bread', checked: true },
            { id: '1-3', name: 'Eggs (dozen)', checked: true },
            { id: '1-4', name: 'Chicken breast (1kg)', checked: false },
            { id: '1-5', name: 'Rice (2kg)', checked: true },
            { id: '1-6', name: 'Beans (1kg)', checked: true },
        ]
    },
    {
        id: '2',
        title: 'Barbecue for friends',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
            { id: '2-1', name: 'Picanha (2kg)', checked: true },
            { id: '2-2', name: 'Sausage (1kg)', checked: true },
            { id: '2-3', name: 'Garlic bread', checked: true },
            { id: '2-4', name: 'Charcoal', checked: true },
            { id: '2-5', name: 'Beer (2 packs)', checked: true },
        ]
    }
];

export const MOCK_PURCHASE_HISTORY: PurchaseRecord[] = [
    {
        id: 'pr-1',
        storeName: 'Pão de Açúcar',
        purchaseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 412.80,
        nfeUrl: 'http://example.com/nfe1',
        items: [
            { name: 'Leite Integral Qualitá', brand: 'Qualitá', quantity: 12, unitPrice: 4.50, totalPrice: 54.00 },
            { name: 'Pão de Forma Pullman', brand: 'Pullman', quantity: 2, unitPrice: 8.00, totalPrice: 16.00 },
            { name: 'Café em Pó 3 Corações', brand: '3 Corações', quantity: 1, unitPrice: 18.50, totalPrice: 18.50 },
            { name: 'Contra Filé Friboi (kg)', brand: 'Friboi', quantity: 1.5, unitPrice: 55.00, totalPrice: 82.50 },
        ]
    }
];

// Phase 4 Mocks
export const MOCK_BENEFICIARIES: Beneficiary[] = [
    { id: '1', name: 'Carlos Silva', relationship: 'Spouse', allocation: '50% of investments', status: 'Confirmed' },
    { id: '2', name: 'Joana Silva', relationship: 'Daughter', allocation: '25% of investments', status: 'Confirmed' },
    { id: '3', name: 'Pedro Silva', relationship: 'Son', allocation: '25% of investments', status: 'Pending' },
];

export const MOCK_INSURANCE_POLICIES: InsurancePolicy[] = [
    { id: '1', type: 'Life', provider: 'Seguradora XYZ', coverage: 1000000, premium: 99, status: 'Active' },
    { id: '2', type: 'Home', provider: 'Porto Seguro', coverage: 800000, premium: 250, status: 'Active' },
    { id: '3', type: 'Auto', provider: 'Tokio Marine', coverage: 50000, premium: 180, status: 'Expiring Soon' },
];

export const MOCK_FINANCIAL_GOALS: FinancialGoal[] = [
    { id: '1', name: 'Buy a house', targetAmount: 600000, currentAmount: 150000, targetDate: 'Dec 2027' },
    { id: '2', name: 'Vacation', targetAmount: 30000, currentAmount: 28000, targetDate: 'Jun 2025' },
    { id: '3', name: 'Kids\' Education', targetAmount: 200000, currentAmount: 45000, targetDate: 'Aug 2028' },
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
    { id: '1', name: 'Mariana Silva', role: 'Admin' },
    { id: '2', name: 'Carlos Silva', role: 'Member' },
    { id: '3', name: 'Joana Silva', role: 'Child' },
];