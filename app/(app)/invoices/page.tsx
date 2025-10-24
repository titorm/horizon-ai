'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Invoice, InvoiceStatus } from '@/lib/types';
import { UploadCloudIcon, AlertTriangleIcon } from '@/components/assets/Icons';

// Mock data - in a real app, this would come from an API
const MOCK_INVOICES: Invoice[] = [
  { $id: '1', fileName: 'apple-macbook-pro.pdf', uploadDate: 'Oct 20, 2023', status: 'COMPLETED' },
  { $id: '2', fileName: 'fast-shop-tv.xml', uploadDate: 'Oct 19, 2023', status: 'COMPLETED' },
  { $id: '3', fileName: 'invoice-09-2023.jpg', uploadDate: 'Oct 18, 2023', status: 'PROCESSING' },
  { $id: '4', fileName: 'scan-001.png', uploadDate: 'Oct 17, 2023', status: 'FAILED' },
];

function InvoiceItem({ invoice }: { invoice: Invoice }) {
  const statusVariant: Record<InvoiceStatus, 'secondary' | 'primary' | 'error'> = {
    COMPLETED: 'secondary',
    PROCESSING: 'primary',
    FAILED: 'error',
  };

  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="flex-grow">
        <p className="font-medium text-on-surface">{invoice.fileName}</p>
        <p className="text-sm text-on-surface-variant">Uploaded: {invoice.uploadDate}</p>
      </div>
      <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
    </Card>
  );
}

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [userRole] = useState<'FREE' | 'PREMIUM'>('PREMIUM'); // This would come from auth context

  const handleUpgrade = () => {
    // Navigate to pricing page or show upgrade modal
    window.location.href = '/pricing';
  };

  if (userRole === 'FREE') {
    return (
      <div className="p-4 md:p-8 text-center flex flex-col items-center justify-center h-full">
        <div className="bg-tertiary/20 p-3 rounded-full mb-4">
          <AlertTriangleIcon className="w-8 h-8 text-tertiary" />
        </div>
        <h2 className="text-2xl font-medium text-on-surface mb-2">Unlock Invoice Intelligence</h2>
        <p className="text-on-surface-variant max-w-md mb-6">
          Upgrade to Premium to automatically process invoices, track products, and manage warranties without manual
          effort.
        </p>
        <Button onClick={handleUpgrade}>Upgrade to Premium</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-normal text-on-surface">Your Invoices & Receipts</h1>
        <p className="text-base text-on-surface-variant">
          Upload your invoices to automatically track purchases and warranties.
        </p>
      </header>

      <main className="space-y-6">
        <Card className="p-6">
          <div className="border-2 border-dashed border-outline rounded-m p-8 text-center">
            <UploadCloudIcon className="mx-auto h-12 w-12 text-on-surface-variant" />
            <h3 className="mt-2 text-lg font-medium text-on-surface">Drag and drop files here</h3>
            <p className="mt-1 text-sm text-on-surface-variant">PDF, XML, JPG, PNG up to 10MB</p>
            <div className="mt-6">
              <Button>Or click to upload</Button>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-medium text-on-surface mb-4">Uploaded Invoices</h2>
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <InvoiceItem key={invoice.$id} invoice={invoice} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center flex flex-col items-center border-2 border-dashed border-outline bg-surface shadow-none">
              <UploadCloudIcon className="w-10 h-10 text-on-surface-variant mb-3" />
              <h3 className="text-lg font-medium text-on-surface">No Invoices Uploaded</h3>
              <p className="text-on-surface-variant text-sm mt-1 max-w-xs">
                Use the uploader above to add invoices and receipts.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
