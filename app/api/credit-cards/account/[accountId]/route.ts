import { getCurrentUserId } from '@/lib/auth/session';
import { CreditCardService } from '@/lib/services/credit-card.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/credit-cards/account/[accountId]
 * Get all credit cards for a specific account
 */
export async function GET(request: NextRequest, { params }: { params: { accountId: string } }) {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const accountId = params.accountId;

    if (!accountId) {
      return NextResponse.json({ message: 'Account ID is required' }, { status: 400 });
    }

    // Fetch credit cards for the account
    const creditCardService = new CreditCardService();
    const creditCards = await creditCardService.getCreditCardsByAccountId(accountId);

    return NextResponse.json({
      success: true,
      data: creditCards,
    });
  } catch (error: any) {
    console.error('GET /api/credit-cards/account/[accountId] error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch credit cards',
      },
      { status: 500 },
    );
  }
}
