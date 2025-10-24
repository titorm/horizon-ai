'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const faqs = [
  {
    q: 'Is it safe to connect my bank accounts?',
    a: 'Yes. We use the official Open Finance Brazil framework, which means we never see or store your bank password. Your connection is authenticated directly with your bank.',
  },
  {
    q: 'How does invoice processing work?',
    a: 'Our AI reads the data from your uploaded invoices (NF-e/NFC-e) to automatically identify products, purchase dates, and warranty information, saving you manual entry.',
  },
  {
    q: 'Can I use Horizon AI for my taxes?',
    a: 'Our Premium plan includes an advanced IRPF (Income Tax) module that consolidates your financial data to generate a detailed report, simplifying your annual declaration.',
  },
];

export default function HelpPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-normal text-on-surface">Help & Support</h1>
        <p className="text-base text-on-surface-variant">
          Find answers to your questions or contact us directly.
        </p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-medium text-on-surface mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="p-4 bg-surface-variant/30 rounded-m">
                <summary className="font-medium text-on-surface cursor-pointer">{faq.q}</summary>
                <p className="text-on-surface-variant mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
        <Card className="p-6 h-fit">
          <h2 className="text-xl font-medium text-on-surface mb-4">Contact Support</h2>
          <form className="space-y-4">
            <Input id="email" label="Your Email" type="email" defaultValue="mariana@example.com" />
            <Input
              id="subject"
              label="Subject"
              type="text"
              placeholder="e.g., Problem with invoice upload"
            />
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-on-surface-variant mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Describe your issue in detail..."
                className="w-full p-3 bg-surface border border-outline rounded-m focus:ring-2 focus:ring-primary focus:outline-none transition-colors duration-200"
              ></textarea>
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
