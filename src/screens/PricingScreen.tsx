import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircleIcon } from '../assets/Icons';

interface PricingScreenProps {
  onSelectPlan: () => void;
  onBack: () => void;
}

const features = [
  'Unlimited connected accounts',
  'Real-time transaction sync',
  'AI-powered invoice processing',
  'Automatic warranty tracking',
  'Advanced expense categorization',
  'Tax report generation (IRPF)',
  'Priority support',
];

const PricingScreen: React.FC<PricingScreenProps> = ({ onSelectPlan, onBack }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
       <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-normal text-on-surface mb-2">Upgrade to Premium</h1>
        <p className="text-base text-on-surface-variant max-w-lg">Unlock the full power of Horizon AI to save time, reduce anxiety, and optimize your financial life.</p>
      </div>

      <div className="flex items-center justify-center space-x-2 mb-8 p-1 bg-primary-container rounded-full">
        <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${billingCycle === 'monthly' ? 'bg-surface shadow-sm' : 'text-on-primary-container'}`}
        >
            Monthly
        </button>
        <button 
            onClick={() => setBillingCycle('annually')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium relative ${billingCycle === 'annually' ? 'bg-surface shadow-sm' : 'text-on-primary-container'}`}
        >
            Annually
            <span className="absolute -top-2 -right-2 bg-tertiary text-on-surface text-xs font-bold px-2 py-0.5 rounded-full">Save 30%</span>
        </button>
      </div>

      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <p className="text-4xl font-bold text-primary">
            {billingCycle === 'annually' ? 'R$ 29' : 'R$ 39'}
            <span className="text-base font-medium text-on-surface-variant">/mês</span>
          </p>
          <p className="text-sm text-on-surface-variant">
            {billingCycle === 'annually' ? 'Billed as R$ 349 per year' : 'Billed monthly'}
          </p>
        </div>

        <ul className="space-y-3 mb-8">
            {features.map(feature => (
                 <li key={feature} className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
                    <span className="text-on-surface-variant">{feature}</span>
                </li>
            ))}
        </ul>

        <Button onClick={onSelectPlan} className="w-full">
          Upgrade and Continue
        </Button>
      </Card>
      <Button variant="outlined" onClick={onBack} className="mt-6 border-none text-on-surface-variant hover:bg-transparent">
          Maybe later
      </Button>
    </div>
  );
};

export default PricingScreen;