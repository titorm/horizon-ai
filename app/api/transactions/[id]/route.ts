import { getCurrentUserId } from '@/lib/auth/session';
import { TransactionService } from '@/lib/services/transaction.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/transactions/[id]
 * Get a specific transaction by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ message: 'Transaction ID is required' }, { status: 400 });
    }

    // Fetch transaction
    const transactionService = new TransactionService();
    const transaction = await transactionService.getTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Verify ownership
    if (transaction.user_id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    console.error('GET /api/transactions/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch transaction',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/transactions/[id]
 * Update a specific transaction
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ message: 'Transaction ID is required' }, { status: 400 });
    }

    // Verify transaction exists and user owns it
    const transactionService = new TransactionService();
    const existingTransaction = await transactionService.getTransactionById(transactionId);

    if (!existingTransaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    if (existingTransaction.user_id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();

    // Validate amount if provided
    if (body.amount !== undefined) {
      const amount = Number(body.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ message: 'Amount must be a positive number' }, { status: 400 });
      }
    }

    // Validate type if provided
    if (body.type) {
      const validTypes = ['income', 'expense', 'transfer'];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          {
            message: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}`,
          },
          { status: 400 },
        );
      }
    }

    // Validate date if provided
    if (body.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
      if (!dateRegex.test(body.date)) {
        return NextResponse.json(
          {
            message: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)',
          },
          { status: 400 },
        );
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          },
          { status: 400 },
        );
      }
    }

    // Validate tags if provided
    if (body.tags && !Array.isArray(body.tags)) {
      return NextResponse.json({ message: 'Tags must be an array' }, { status: 400 });
    }

    // Validate location if provided
    if (body.location) {
      if (typeof body.location !== 'object') {
        return NextResponse.json({ message: 'Location must be an object' }, { status: 400 });
      }

      if (body.location.latitude !== undefined) {
        const lat = Number(body.location.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          return NextResponse.json({ message: 'Latitude must be between -90 and 90' }, { status: 400 });
        }
      }

      if (body.location.longitude !== undefined) {
        const lng = Number(body.location.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          return NextResponse.json({ message: 'Longitude must be between -180 and 180' }, { status: 400 });
        }
      }
    }

    // Validate recurring pattern if provided
    if (body.recurringPattern) {
      if (typeof body.recurringPattern !== 'object') {
        return NextResponse.json({ message: 'Recurring pattern must be an object' }, { status: 400 });
      }

      const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
      if (body.recurringPattern.frequency && !validFrequencies.includes(body.recurringPattern.frequency)) {
        return NextResponse.json(
          {
            message: `Invalid recurring frequency. Must be one of: ${validFrequencies.join(', ')}`,
          },
          { status: 400 },
        );
      }

      if (body.recurringPattern.interval !== undefined && body.recurringPattern.interval < 1) {
        return NextResponse.json({ message: 'Recurring interval must be at least 1' }, { status: 400 });
      }
    }

    // Build update data
    const updateData: any = {};

    if (body.amount !== undefined) updateData.amount = Number(body.amount);
    if (body.type) updateData.type = body.type;
    if (body.date) updateData.date = body.date;
    if (body.category) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.currency) updateData.currency = body.currency;
    if (body.accountId || body.account_id) updateData.accountId = body.accountId || body.account_id;
    if (body.merchant !== undefined) updateData.merchant = body.merchant;
    if (body.tags) updateData.tags = body.tags;
    if (body.location) updateData.location = body.location;
    if (body.receiptUrl || body.receipt_url) updateData.receiptUrl = body.receiptUrl || body.receipt_url;
    if (body.isRecurring !== undefined || body.is_recurring !== undefined) {
      updateData.isRecurring = body.isRecurring ?? body.is_recurring;
    }
    if (body.recurringPattern || body.recurring_pattern) {
      updateData.recurringPattern = body.recurringPattern || body.recurring_pattern;
    }
    if (body.status) updateData.status = body.status;

    // Update transaction
    const updatedTransaction = await transactionService.updateTransaction(transactionId, updateData);

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
    });
  } catch (error: any) {
    console.error('PATCH /api/transactions/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update transaction',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Delete a specific transaction
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ message: 'Transaction ID is required' }, { status: 400 });
    }

    // Verify transaction exists and user owns it
    const transactionService = new TransactionService();
    const existingTransaction = await transactionService.getTransactionById(transactionId);

    if (!existingTransaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    if (existingTransaction.user_id !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Delete transaction
    await transactionService.deleteTransaction(transactionId);

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE /api/transactions/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete transaction',
      },
      { status: 500 },
    );
  }
}
