import { getCurrentUserId } from '@/lib/auth/session';
import { TransactionService } from '@/lib/services/transaction.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/transactions/stats/[userId]
 * Get transaction statistics for a specific user
 */
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    // Get authenticated user ID
    const authenticatedUserId = await getCurrentUserId();

    if (!authenticatedUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const targetUserId = params.userId;

    if (!targetUserId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Verify user can only access their own stats
    if (targetUserId !== authenticatedUserId) {
      return NextResponse.json(
        {
          message: 'Forbidden: You can only access your own transaction statistics',
        },
        { status: 403 },
      );
    }

    // Parse query parameters for date range
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate date formats if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

    if (startDate && !dateRegex.test(startDate)) {
      return NextResponse.json(
        {
          message: 'Invalid startDate format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
        },
        { status: 400 },
      );
    }

    if (endDate && !dateRegex.test(endDate)) {
      return NextResponse.json(
        {
          message: 'Invalid endDate format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
        },
        { status: 400 },
      );
    }

    // Fetch statistics
    const transactionService = new TransactionService();
    const stats = await transactionService.getTransactionStats(
      targetUserId,
      startDate || undefined,
      endDate || undefined,
    );

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('GET /api/transactions/stats/[userId] error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch transaction statistics',
      },
      { status: 500 },
    );
  }
}
