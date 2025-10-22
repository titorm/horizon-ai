/**
 * Example Integration Service
 *
 * This file demonstrates how to create an integration service that:
 * 1. Connects to a bank API (example: Plaid, Open Banking, etc.)
 * 2. Fetches transactions from the bank
 * 3. Transforms them to our internal format
 * 4. Syncs them to our database via the transactions API
 */

import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { CreateIntegrationTransactionDto } from '../database/dto';

interface BankTransaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  merchant?: string;
  category?: string;
  status: string;
  currency: string;
  accountId: string;
}

interface BankConnection {
  id: string;
  userId: string;
  bankName: string;
  accessToken: string;
  lastSyncDate?: string;
}

@Injectable()
export class BankIntegrationService {
  private readonly logger = new Logger(BankIntegrationService.name);
  private readonly apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000';

  /**
   * Main sync method - fetches and syncs transactions from bank
   */
  async syncBankTransactions(
    bankConnection: BankConnection,
    authToken: string,
  ): Promise<{ success: boolean; synced: number; errors: number }> {
    this.logger.log(`Starting sync for user ${bankConnection.userId} from ${bankConnection.bankName}`);

    try {
      // 1. Fetch transactions from bank API
      const bankTransactions = await this.fetchBankTransactions(bankConnection);
      this.logger.log(`Fetched ${bankTransactions.length} transactions from bank`);

      // 2. Transform to our format
      const transactions = this.transformTransactions(bankTransactions, bankConnection);

      // 3. Sync to our database
      const result = await this.bulkCreateTransactions(transactions, authToken);

      this.logger.log(`Sync completed: ${result.synced} synced, ${result.errors} errors`);
      return result;
    } catch (error) {
      this.logger.error('Error syncing bank transactions:', error);
      throw error;
    }
  }

  /**
   * Fetch transactions from bank API
   * This is a mock implementation - replace with actual bank API calls
   */
  private async fetchBankTransactions(bankConnection: BankConnection): Promise<BankTransaction[]> {
    // Example: Using Plaid, Open Banking, or similar
    // const response = await plaidClient.transactionsGet({
    //   access_token: bankConnection.accessToken,
    //   start_date: bankConnection.lastSyncDate || '2025-01-01',
    //   end_date: new Date().toISOString().split('T')[0],
    // });

    // Mock data for demonstration
    return [
      {
        id: 'bank_txn_1',
        amount: -50.0,
        date: '2025-10-21T08:00:00Z',
        description: 'Uber viagem',
        merchant: 'Uber',
        category: 'Transportation',
        status: 'posted',
        currency: 'BRL',
        accountId: 'account_123',
      },
      {
        id: 'bank_txn_2',
        amount: -120.5,
        date: '2025-10-21T12:30:00Z',
        description: 'Restaurante XYZ',
        merchant: 'Restaurante XYZ',
        category: 'Food and Drink',
        status: 'posted',
        currency: 'BRL',
        accountId: 'account_123',
      },
      {
        id: 'bank_txn_3',
        amount: 5000.0,
        date: '2025-10-20T00:00:00Z',
        description: 'Salário - Empresa ABC',
        merchant: 'Empresa ABC',
        category: 'Income',
        status: 'posted',
        currency: 'BRL',
        accountId: 'account_123',
      },
    ];
  }

  /**
   * Transform bank transactions to our internal format
   */
  private transformTransactions(
    bankTransactions: BankTransaction[],
    bankConnection: BankConnection,
  ): CreateIntegrationTransactionDto[] {
    return bankTransactions.map((bt) => {
      const isIncome = bt.amount > 0;
      const category = this.categorizeTransaction(bt);

      return {
        userId: bankConnection.userId,
        amount: Math.abs(bt.amount),
        type: isIncome ? ('income' as const) : ('expense' as const),
        category,
        description: bt.description,
        date: bt.date,
        accountId: bt.accountId,
        merchant: bt.merchant,
        currency: bt.currency,
        status: bt.status === 'posted' ? ('completed' as const) : ('pending' as const),
        integrationId: bankConnection.id,
        integrationData: {
          bankTransactionId: bt.id,
          bankName: bankConnection.bankName,
          originalCategory: bt.category,
          rawTransaction: bt,
        },
      };
    });
  }

  /**
   * Categorize transaction based on merchant and description
   * This is a simple rule-based categorization
   * In production, you might want to use ML or more sophisticated rules
   */
  private categorizeTransaction(transaction: BankTransaction): string {
    const text = `${transaction.description} ${transaction.merchant || ''}`.toLowerCase();

    const categoryRules = {
      Alimentação: /restaurante|lanchonete|padaria|supermercado|mercado|food|cafe|coffee/,
      Transporte: /uber|taxi|99|metro|onibus|combustivel|gas|parking|estacionamento/,
      Assinaturas: /netflix|spotify|amazon prime|youtube|subscription/,
      Saúde: /farmacia|drogaria|hospital|clinica|dentista|pharmacy|health/,
      Educação: /escola|faculdade|curso|livro|university|education/,
      Entretenimento: /cinema|teatro|show|ingresso|ticket|entertainment/,
      Moradia: /aluguel|condominio|luz|agua|internet|rent|utility/,
      Compras: /loja|shopping|store|amazon|mercado livre/,
      Salário: /salario|salary|payroll|empresa/,
      Transferência: /transfer|pix|ted|doc/,
    };

    for (const [category, regex] of Object.entries(categoryRules)) {
      if (regex.test(text)) {
        return category;
      }
    }

    // Default category based on bank's original category
    if (transaction.category) {
      const categoryMap: Record<string, string> = {
        'Food and Drink': 'Alimentação',
        Transportation: 'Transporte',
        Transfer: 'Transferência',
        Income: 'Salário',
        Travel: 'Viagem',
        Recreation: 'Entretenimento',
      };
      return categoryMap[transaction.category] || transaction.category;
    }

    return 'Outros';
  }

  /**
   * Bulk create transactions via our API
   */
  private async bulkCreateTransactions(
    transactions: CreateIntegrationTransactionDto[],
    authToken: string,
  ): Promise<{ success: boolean; synced: number; errors: number }> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/transactions/integration/bulk`, transactions, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        synced: response.data.total || 0,
        errors: 0,
      };
    } catch (error: any) {
      this.logger.error('Error creating transactions in bulk:', error.response?.data || error.message);
      return {
        success: false,
        synced: 0,
        errors: transactions.length,
      };
    }
  }

  /**
   * Example: Scheduled sync job
   * This could be called by a cron job to sync periodically
   */
  async scheduledSync(userId: string, authToken: string): Promise<void> {
    this.logger.log(`Running scheduled sync for user ${userId}`);

    // 1. Get user's bank connections from database
    const bankConnections = await this.getUserBankConnections(userId);

    // 2. Sync each connection
    for (const connection of bankConnections) {
      try {
        await this.syncBankTransactions(connection, authToken);

        // 3. Update last sync date
        await this.updateLastSyncDate(connection.id);
      } catch (error) {
        this.logger.error(`Error syncing connection ${connection.id}:`, error);
        // Continue with next connection
      }
    }
  }

  /**
   * Mock: Get user's bank connections
   * In production, this would query your database
   */
  private async getUserBankConnections(userId: string): Promise<BankConnection[]> {
    // Mock implementation
    return [
      {
        id: 'bank_conn_1',
        userId,
        bankName: 'Banco XYZ',
        accessToken: 'mock_access_token',
        lastSyncDate: '2025-10-20',
      },
    ];
  }

  /**
   * Mock: Update last sync date
   * In production, this would update your database
   */
  private async updateLastSyncDate(connectionId: string): Promise<void> {
    this.logger.log(`Updated last sync date for connection ${connectionId}`);
    // await this.databaseService.updateBankConnection(connectionId, {
    //   lastSyncDate: new Date().toISOString(),
    // });
  }
}

/**
 * Example usage in a controller:
 *
 * @Controller('integrations')
 * export class IntegrationsController {
 *   constructor(private readonly bankIntegrationService: BankIntegrationService) {}
 *
 *   @Post('sync/:userId')
 *   async syncTransactions(
 *     @Param('userId') userId: string,
 *     @Headers('authorization') authToken: string,
 *   ) {
 *     const result = await this.bankIntegrationService.scheduledSync(
 *       userId,
 *       authToken.replace('Bearer ', ''),
 *     );
 *     return { success: true, message: 'Sync completed' };
 *   }
 * }
 */
