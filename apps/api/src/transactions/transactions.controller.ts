import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppwriteTransactionService } from '../database/services/appwrite-transaction.service';
import {
  CreateTransactionDto,
  CreateIntegrationTransactionDto,
  UpdateTransactionDto,
  TransactionFilterDto,
} from '../database/dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Transaction } from '../database/appwrite-schema';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionService: AppwriteTransactionService) {}

  /**
   * Helper to format transaction with expanded data field
   */
  private formatTransactionResponse(transaction: Transaction): any {
    const data = transaction.data ? JSON.parse(transaction.data) : {};

    return {
      // Core indexed fields
      $id: transaction.$id,
      $createdAt: transaction.$createdAt,
      $updatedAt: transaction.$updatedAt,
      userId: transaction.user_id,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      status: transaction.status,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
      // Expand data fields for API response
      category: data.category,
      description: data.description,
      currency: data.currency,
      source: data.source,
      accountId: data.account_id,
      merchant: data.merchant,
      integrationId: data.integration_id,
      integrationData: data.integration_data,
      tags: data.tags,
      location: data.location,
      receiptUrl: data.receipt_url,
      isRecurring: data.is_recurring,
      recurringPattern: data.recurring_pattern,
    };
  } /**
   * Helper to format multiple transactions
   */
  private formatTransactionsResponse(transactions: Transaction[]): any[] {
    return transactions.map((t) => this.formatTransactionResponse(t));
  }

  /**
   * Create a manual transaction (called from frontend)
   * POST /transactions/manual
   */
  @Post('manual')
  @HttpCode(HttpStatus.CREATED)
  async createManualTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = await this.transactionService.createManualTransaction(createTransactionDto);
      return {
        success: true,
        data: this.formatTransactionResponse(transaction),
        message: 'Transaction created successfully',
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create transaction');
    }
  }

  /**
   * Create a transaction from integration
   * POST /transactions/integration
   */
  @Post('integration')
  @HttpCode(HttpStatus.CREATED)
  async createIntegrationTransaction(@Body() createIntegrationTransactionDto: CreateIntegrationTransactionDto) {
    try {
      const transaction = await this.transactionService.createIntegrationTransaction(createIntegrationTransactionDto);
      return {
        success: true,
        data: this.formatTransactionResponse(transaction),
        message: 'Transaction created from integration successfully',
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to create integration transaction');
    }
  }

  /**
   * Bulk create transactions from integration
   * POST /transactions/integration/bulk
   */
  @Post('integration/bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreateIntegrationTransactions(@Body() transactions: CreateIntegrationTransactionDto[]) {
    try {
      if (!Array.isArray(transactions) || transactions.length === 0) {
        throw new BadRequestException('Transactions array is required and cannot be empty');
      }

      const createdTransactions = await this.transactionService.bulkCreateIntegrationTransactions(transactions);
      return {
        success: true,
        data: this.formatTransactionsResponse(createdTransactions),
        message: `${createdTransactions.length} transactions created successfully`,
        total: createdTransactions.length,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to bulk create transactions');
    }
  }

  /**
   * Get transaction by ID
   * GET /transactions/:id
   */
  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    const transaction = await this.transactionService.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return {
      success: true,
      data: this.formatTransactionResponse(transaction),
    };
  }

  /**
   * Update transaction
   * PUT /transactions/:id
   */
  @Put(':id')
  async updateTransaction(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    try {
      const transaction = await this.transactionService.updateTransaction(id, updateTransactionDto);
      return {
        success: true,
        data: this.formatTransactionResponse(transaction),
        message: 'Transaction updated successfully',
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update transaction');
    }
  }

  /**
   * Delete transaction
   * DELETE /transactions/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('id') id: string) {
    try {
      await this.transactionService.deleteTransaction(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to delete transaction');
    }
  }

  /**
   * List transactions with filters
   * GET /transactions
   */
  @Get()
  async listTransactions(@Query() filters: TransactionFilterDto) {
    try {
      const result = await this.transactionService.listTransactions(filters);
      return {
        success: true,
        data: this.formatTransactionsResponse(result.transactions),
        total: result.total,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to list transactions');
    }
  }

  /**
   * Get transaction statistics
   * GET /transactions/stats/:userId
   */
  @Get('stats/:userId')
  async getTransactionStats(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const stats = await this.transactionService.getTransactionStats(userId, startDate, endDate);
      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to get transaction statistics');
    }
  }
}
