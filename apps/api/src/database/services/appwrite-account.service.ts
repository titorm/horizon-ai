import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { AppwriteDBAdapter } from '../../appwrite/appwrite-db-adapter';
import { DATABASE_ID, COLLECTIONS } from '../appwrite-schema';
import type { Account, AccountData } from '../appwrite-schema';
import { CreateAccountDto, UpdateAccountDto } from '../dto';
import { ID, Query } from 'node-appwrite';
import { AppwriteTransactionService } from './appwrite-transaction.service';

@Injectable()
export class AppwriteAccountService {
  constructor(
    private readonly dbAdapter: AppwriteDBAdapter,
    @Inject(AppwriteTransactionService)
    private readonly transactionService: AppwriteTransactionService,
  ) {}

  /**
   * Create a new account for a user
   */
  async createAccount(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    try {
      const accountData: AccountData = {
        status: createAccountDto.status || 'Manual',
        bank_id: createAccountDto.bank_id,
        last_digits: createAccountDto.last_digits,
        integration_id: createAccountDto.integration_id,
        integration_data: createAccountDto.integration_data,
      };

      const document = await this.dbAdapter.createDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, ID.unique(), {
        user_id: userId,
        name: createAccountDto.name,
        account_type: createAccountDto.account_type,
        balance: createAccountDto.initial_balance || 0,
        is_manual: createAccountDto.is_manual ?? true,
        data: JSON.stringify(accountData),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const account = this.deserializeAccount(document);

      // Create initial transaction if there's an initial balance
      if (createAccountDto.initial_balance && createAccountDto.initial_balance > 0) {
        try {
          await this.transactionService.createManualTransaction({
            userId: userId,
            amount: createAccountDto.initial_balance,
            type: 'income',
            category: 'balance',
            description: `Saldo inicial da conta ${createAccountDto.name}`,
            date: new Date().toISOString(),
            currency: 'BRL',
            accountId: account.$id,
            status: 'completed',
          });
        } catch (error: any) {
          console.error('Failed to create initial balance transaction:', error);
          // Don't fail the account creation if transaction fails
        }
      }

      return account;
    } catch (error: any) {
      throw new BadRequestException(`Failed to create account: ${error.message}`);
    }
  }

  /**
   * Get all accounts for a user
   */
  async getAccountsByUserId(userId: string): Promise<Account[]> {
    try {
      const result = await this.dbAdapter.listDocuments(DATABASE_ID, COLLECTIONS.ACCOUNTS, [
        Query.equal('user_id', userId),
        Query.orderDesc('created_at'),
      ]);

      const documents = result.documents || [];
      const accounts = documents.map((doc: any) => this.deserializeAccount(doc));

      // Calculate real balance based on transactions for each account
      for (const account of accounts) {
        const realBalance = await this.calculateAccountBalance(account.$id);
        account.balance = realBalance;
      }

      return accounts;
    } catch (error: any) {
      throw new BadRequestException(`Failed to fetch accounts: ${error.message}`);
    }
  }

  /**
   * Calculate account balance based on initial balance + transactions (excluding credit card transactions)
   */
  async calculateAccountBalance(accountId: string): Promise<number> {
    try {
      // Get the account to get initial balance
      const accountDoc = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId);
      const initialBalance = accountDoc.balance || 0;

      // Get all transactions for this account
      const transactionsResult = await this.dbAdapter.listDocuments(DATABASE_ID, COLLECTIONS.TRANSACTIONS, [
        Query.equal('user_id', accountDoc.user_id),
        Query.limit(10000), // Get all transactions
      ]);

      let transactionSum = 0;

      for (const transaction of transactionsResult.documents || []) {
        // Parse transaction data to check if it has account_id and credit_card_id
        let transactionData: any = {};
        if (transaction.data) {
          try {
            transactionData = typeof transaction.data === 'string' ? JSON.parse(transaction.data) : transaction.data;
          } catch {
            transactionData = {};
          }
        }

        // Only include transactions for this account that are NOT credit card transactions
        if (transactionData.account_id === accountId && !transactionData.credit_card_id) {
          if (transaction.type === 'income') {
            transactionSum += transaction.amount;
          } else if (transaction.type === 'expense') {
            transactionSum -= transaction.amount;
          }
        }
      }

      return initialBalance + transactionSum;
    } catch (error: any) {
      console.error(`Error calculating balance for account ${accountId}:`, error);
      // Return the stored balance as fallback
      try {
        const accountDoc = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId);
        return accountDoc.balance || 0;
      } catch {
        return 0;
      }
    }
  }

  /**
   * Get a specific account by ID
   */
  async getAccountById(accountId: string, userId: string): Promise<Account> {
    try {
      const document = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId);

      // Verify the account belongs to the user
      if (document.user_id !== userId) {
        throw new NotFoundException(`Account not found`);
      }

      return this.deserializeAccount(document);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch account: ${error.message}`);
    }
  }

  /**
   * Update an account
   */
  async updateAccount(accountId: string, userId: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    try {
      // First verify the account exists and belongs to the user
      const existingAccount = await this.getAccountById(accountId, userId);

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updateAccountDto.name !== undefined) {
        updateData.name = updateAccountDto.name;
      }

      if (updateAccountDto.account_type !== undefined) {
        updateData.account_type = updateAccountDto.account_type;
      }

      // Update data JSON field if any data fields changed
      if (
        updateAccountDto.bank_id !== undefined ||
        updateAccountDto.last_digits !== undefined ||
        updateAccountDto.status !== undefined
      ) {
        const currentData = existingAccount.data
          ? typeof existingAccount.data === 'string'
            ? JSON.parse(existingAccount.data)
            : existingAccount.data
          : {};

        const newData: AccountData = {
          ...currentData,
          ...(updateAccountDto.bank_id && { bank_id: updateAccountDto.bank_id }),
          ...(updateAccountDto.last_digits && { last_digits: updateAccountDto.last_digits }),
          ...(updateAccountDto.status && { status: updateAccountDto.status }),
        };
        updateData.data = JSON.stringify(newData);
      }

      const document = await this.dbAdapter.updateDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId, updateData);

      return this.deserializeAccount(document);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update account: ${error.message}`);
    }
  }

  /**
   * Delete an account
   */
  async deleteAccount(accountId: string, userId: string): Promise<void> {
    try {
      // First verify the account exists and belongs to the user
      await this.getAccountById(accountId, userId);

      await this.dbAdapter.deleteDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete account: ${error.message}`);
    }
  }

  /**
   * Update account balance (used by transactions)
   */
  async updateAccountBalance(accountId: string, newBalance: number): Promise<Account> {
    try {
      const document = await this.dbAdapter.updateDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId, {
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      return this.deserializeAccount(document);
    } catch (error: any) {
      throw new BadRequestException(`Failed to update account balance: ${error.message}`);
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(accountId: string): Promise<number> {
    try {
      const document = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId);
      return document.balance;
    } catch (error: any) {
      throw new NotFoundException(`Account not found`);
    }
  }

  /**
   * Deserialize Appwrite document to Account type
   */
  private deserializeAccount(document: any): Account {
    let data: AccountData | undefined;

    if (document.data) {
      try {
        data = typeof document.data === 'string' ? JSON.parse(document.data) : document.data;
      } catch {
        data = undefined;
      }
    }

    return {
      $id: document.$id,
      $createdAt: document.$createdAt,
      $updatedAt: document.$updatedAt,
      user_id: document.user_id,
      name: document.name,
      account_type: document.account_type,
      balance: document.balance,
      is_manual: document.is_manual,
      data: data ? JSON.stringify(data) : undefined,
      created_at: document.created_at,
      updated_at: document.updated_at,
    };
  }
}
