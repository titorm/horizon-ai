
import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MOCK_BALANCE, MOCK_TRANSACTIONS, MOCK_MONTHLY_INCOME, MOCK_MONTHLY_EXPENSES, MOCK_INSIGHTS, MOCK_CHART_DATA } from '../../constants';
import type { Transaction, User, FinancialInsight, InsightType } from '../../types';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, LightbulbIcon, LineChartIcon, TrendingDownIcon, TrendingUpIcon } from '../assets/Icons';
import Skeleton from '../components/ui/Skeleton';

// --- BarChart Component Definition ---
interface ChartData {
  month: string;
  income: number;
  expenses: number;
}

const formatCurrencyForChart = (value: number) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
};

const BarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const maxValue = React.useMemo(() => {
    const allValues = data.flatMap(d => [d.income, d.expenses]);
    const max = Math.max(...allValues);
    return Math.ceil(max / 5000) * 5000;
  }, [data]);

  const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
    const value = (maxValue / 4) * i;
    return { value, label: formatCurrencyForChart(value) };
  }).reverse();

  return (
    <div className="w-full">
        <div className="flex justify-end gap-4 mb-4">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-secondary"></div>
                <span className="text-xs text-on-surface-variant">Income</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-error"></div>
                <span className="text-xs text-on-surface-variant">Expenses</span>
            </div>
        </div>
        <div className="flex gap-4" style={{ height: '250px' }}>
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-right text-xs text-on-surface-variant h-full py-1">
                {yAxisLabels.map(({ label }) => (
                <span key={label}>{label}</span>
                ))}
            </div>

            {/* Chart Bars Area */}
            <div className="flex-grow grid grid-cols-6 gap-3 border-l border-b border-outline/50 relative">
                 {/* Grid lines */}
                {yAxisLabels.slice(0, -1).map(({ value }) => (
                    <div key={value} className="col-span-6 border-t border-dashed border-outline/50 absolute w-full" style={{ bottom: `${(value / maxValue) * 100}%`}}></div>
                ))}

                {data.map((item) => (
                    <div key={item.month} className="flex flex-col items-center justify-end h-full relative group pt-1">
                        <div className="flex gap-1 items-end h-full w-full justify-center">
                            <div
                                className="w-1/2 bg-secondary rounded-t-xs hover:opacity-80 transition-all duration-300 ease-in-out"
                                style={{ height: `${(item.income / maxValue) * 100}%` }}
                            ></div>
                            <div
                                className="w-1/2 bg-error rounded-t-xs hover:opacity-80 transition-all duration-300 ease-in-out"
                                style={{ height: `${(item.expenses / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-on-surface-variant mt-1 absolute -bottom-5">{item.month}</span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 w-40 p-2 bg-on-surface text-surface rounded-m text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <p className="font-bold mb-1 text-center">{item.month} 2024</p>
                            <p className="flex justify-between items-center">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-secondary"></div><span className="text-surface/80">Income:</span></span>
                                <span>{item.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </p>
                            <p className="flex justify-between items-center">
                                 <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-error"></div><span className="text-surface/80">Expenses:</span></span>
                                <span>{item.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </p>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-on-surface -mb-1"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
// --- End of BarChart Component ---


const FinancialInsightCard: React.FC<{ insight: FinancialInsight }> = ({ insight }) => {
    const insightMeta: Record<InsightType, { icon: React.ReactNode; color: string }> = {
        SAVINGS_OPPORTUNITY: {
            icon: <LightbulbIcon className="w-6 h-6 text-tertiary" />,
            color: 'border-tertiary',
        },
        UNUSUAL_SPENDING: {
            icon: <TrendingDownIcon className="w-6 h-6 text-error" />,
            color: 'border-error',
        },
        CASH_FLOW_FORECAST: {
            icon: <LineChartIcon className="w-6 h-6 text-secondary" />,
            color: 'border-secondary',
        },
    };

    const { icon, color } = insightMeta[insight.type];

    return (
        <Card className={`p-4 border-l-4 ${color}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{icon}</div>
                <div className="flex-grow">
                    <h4 className="font-medium text-on-surface">{insight.title}</h4>
                    <p className="text-sm text-on-surface-variant mt-1 mb-3">{insight.description}</p>
                    <Button variant="text" className="!h-auto !p-0 text-sm">{insight.actionText}</Button>
                </div>
            </div>
        </Card>
    );
};

const DashboardOverviewSkeleton: React.FC = () => (
  <>
    <header className="mb-8">
      <Skeleton className="h-10 w-1/3 mb-2" />
      <Skeleton className="h-6 w-1/2" />
    </header>
    <main className="space-y-8">
      <Card className="p-8 text-center">
        <Skeleton className="h-6 w-1/4 mb-2 mx-auto" />
        <Skeleton className="h-12 w-1/2 mx-auto" />
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 flex items-center">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
       <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-[250px] w-full" />
        </Card>
       <Card className="p-6">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        </Card>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="divide-y divide-outline">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center py-3">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </main>
  </>
);


const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; isNet?: boolean }> = ({ label, value, icon, isNet }) => {
    const isPositive = value >= 0;
    let colorClass = 'text-on-surface';
    if (isNet) {
        colorClass = isPositive ? 'text-secondary' : 'text-error';
    } else if (label.toLowerCase().includes('income')) {
        colorClass = 'text-secondary';
    } else {
        colorClass = 'text-error';
    }

    const formattedValue = `${isPositive && (isNet || label.toLowerCase().includes('income')) ? '+' : ''}${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

    return (
        <Card className="p-4 flex items-center">
            <div className={`mr-4 p-2 rounded-full bg-primary-container`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-on-surface-variant">{label}</p>
                <p className={`text-xl font-medium ${colorClass}`}>{formattedValue}</p>
            </div>
        </Card>
    );
};

const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
    }).format(date);
};


const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.amount > 0;
    const amountColor = isIncome ? 'text-secondary' : 'text-on-surface';
    const formattedAmount = `${isIncome ? '+' : ''}${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    const Icon = transaction.icon;

    return (
        <li className="flex items-center py-3">
             <div className="p-3 bg-primary-container rounded-full mr-4">
                <Icon className="w-5 h-5 text-on-primary-container" />
            </div>
            <div className="flex-grow">
                <p className="text-base font-medium text-on-surface">{transaction.description}</p>
                <p className="text-sm text-on-surface-variant">{formatDate(transaction.date)} • {transaction.bankName}</p>
            </div>
            <p className={`text-base font-medium ${amountColor}`}>{formattedAmount}</p>
        </li>
    );
};

const DashboardOverviewScreen: React.FC<{ user: User; onConnectAnother: () => void; isLoading: boolean; }> = ({ user, onConnectAnother, isLoading }) => {
  if (isLoading) {
    return <DashboardOverviewSkeleton />;
  }

  const formattedBalance = MOCK_BALANCE.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const netMonthly = MOCK_MONTHLY_INCOME + MOCK_MONTHLY_EXPENSES;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-light text-on-surface">Hi, {user.name}!</h1>
        <p className="text-base text-on-surface-variant">Welcome back to your financial dashboard.</p>
      </header>

      <main className="space-y-8">
        <Card className="p-8 text-center">
            <p className="text-sm font-medium text-on-surface-variant mb-1">TOTAL BALANCE</p>
            <h2 className="text-5xl font-light text-primary tracking-tight">{formattedBalance}</h2>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard label="Income this month" value={MOCK_MONTHLY_INCOME} icon={<ArrowUpCircleIcon className="text-secondary"/>} />
            <StatCard label="Expenses this month" value={MOCK_MONTHLY_EXPENSES} icon={<ArrowDownCircleIcon className="text-error" />} />
            <StatCard label="Net this month" value={netMonthly} icon={<TrendingUpIcon className={netMonthly > 0 ? 'text-secondary' : 'text-error'}/>} isNet />
        </div>

        <Card className="p-6">
            <h3 className="text-xl font-medium text-on-surface mb-6">Cash Flow - Last 6 Months</h3>
            <BarChart data={MOCK_CHART_DATA} />
        </Card>

        <div>
            <h3 className="text-xl font-medium text-on-surface mb-4">AI Insights</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MOCK_INSIGHTS.map(insight => (
                    <FinancialInsightCard key={insight.id} insight={insight} />
                ))}
            </div>
        </div>
        
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-on-surface">Recent Transactions</h3>
                <Button onClick={() => {}} variant="text">View All</Button>
            </div>
            <ul className="divide-y divide-outline">
              {MOCK_TRANSACTIONS.slice(0, 5).map(tx => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </ul>
        </Card>
      </main>
    </>
  );
};

export default DashboardOverviewScreen;