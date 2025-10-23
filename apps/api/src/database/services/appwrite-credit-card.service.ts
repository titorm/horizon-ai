import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppwriteDBAdapter } from '../../appwrite/appwrite-db-adapter';
import { DATABASE_ID, COLLECTIONS } from '../appwrite-schema';
import type { CreditCard, CreditCardData } from '../appwrite-schema';
import { CreateCreditCardDto, UpdateCreditCardDto } from '../dto';
import { ID, Query } from 'node-appwrite';

@Injectable()
export class AppwriteCreditCardService {
  constructor(private readonly dbAdapter: AppwriteDBAdapter) {}

  /**
   * Create a new credit card for an account
   */
  async createCreditCard(createCreditCardDto: CreateCreditCardDto): Promise<CreditCard> {
    try {
      const cardData: CreditCardData = {
        brand: createCreditCardDto.brand,
        network: createCreditCardDto.network,
        color: createCreditCardDto.color,
      };

      const document = await this.dbAdapter.createDocument(DATABASE_ID, COLLECTIONS.CREDIT_CARDS, ID.unique(), {
        account_id: createCreditCardDto.account_id,
        name: createCreditCardDto.name,
        last_digits: createCreditCardDto.last_digits,
        credit_limit: createCreditCardDto.credit_limit,
        used_limit: createCreditCardDto.used_limit || 0,
        closing_day: createCreditCardDto.closing_day,
        due_day: createCreditCardDto.due_day,
        data: JSON.stringify(cardData),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return this.deserializeCreditCard(document);
    } catch (error: any) {
      throw new BadRequestException(`Failed to create credit card: ${error.message}`);
    }
  }

  /**
   * Get all credit cards for an account
   */
  async getCreditCardsByAccountId(accountId: string): Promise<CreditCard[]> {
    try {
      const result = await this.dbAdapter.listDocuments(DATABASE_ID, COLLECTIONS.CREDIT_CARDS, [
        Query.equal('account_id', accountId),
        Query.orderDesc('created_at'),
      ]);

      const documents = result.documents || [];
      const creditCards = documents.map((doc: any) => this.deserializeCreditCard(doc));

      // Calculate real used limit based on transactions for each credit card
      for (const card of creditCards) {
        const realUsedLimit = await this.calculateUsedLimit(card.$id, card.account_id);
        card.used_limit = realUsedLimit;
      }

      return creditCards;
    } catch (error: any) {
      throw new BadRequestException(`Failed to fetch credit cards: ${error.message}`);
    }
  }

  /**
   * Calculate credit card used limit based on transactions
   */
  async calculateUsedLimit(creditCardId: string, accountId: string): Promise<number> {
    try {
      // Get the account to get user_id
      const accountDoc = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.ACCOUNTS, accountId);

      // Get all transactions for this user
      const transactionsResult = await this.dbAdapter.listDocuments(DATABASE_ID, COLLECTIONS.TRANSACTIONS, [
        Query.equal('user_id', accountDoc.user_id),
        Query.limit(10000), // Get all transactions
      ]);

      let usedLimit = 0;

      for (const transaction of transactionsResult.documents || []) {
        // Parse transaction data to check if it's for this credit card
        let transactionData: any = {};
        if (transaction.data) {
          try {
            transactionData = typeof transaction.data === 'string' ? JSON.parse(transaction.data) : transaction.data;
          } catch {
            transactionData = {};
          }
        }

        // Only include expense transactions for this credit card
        if (transactionData.credit_card_id === creditCardId && transaction.type === 'expense') {
          usedLimit += transaction.amount;
        }
      }

      return usedLimit;
    } catch (error: any) {
      console.error(`Error calculating used limit for credit card ${creditCardId}:`, error);
      // Return the stored used_limit as fallback
      try {
        const cardDoc = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.CREDIT_CARDS, creditCardId);
        return cardDoc.used_limit || 0;
      } catch {
        return 0;
      }
    }
  }

  /**
   * Get a specific credit card by ID
   */
  async getCreditCardById(creditCardId: string): Promise<CreditCard> {
    try {
      const document = await this.dbAdapter.getDocument(DATABASE_ID, COLLECTIONS.CREDIT_CARDS, creditCardId);

      return this.deserializeCreditCard(document);
    } catch (error: any) {
      throw new NotFoundException(`Credit card not found`);
    }
  }

  /**
   * Update a credit card
   */
  async updateCreditCard(creditCardId: string, updateCreditCardDto: UpdateCreditCardDto): Promise<CreditCard> {
    try {
      // First verify the credit card exists
      const existingCard = await this.getCreditCardById(creditCardId);

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updateCreditCardDto.name !== undefined) {
        updateData.name = updateCreditCardDto.name;
      }

      if (updateCreditCardDto.credit_limit !== undefined) {
        updateData.credit_limit = updateCreditCardDto.credit_limit;
      }

      if (updateCreditCardDto.used_limit !== undefined) {
        updateData.used_limit = updateCreditCardDto.used_limit;
      }

      if (updateCreditCardDto.closing_day !== undefined) {
        updateData.closing_day = updateCreditCardDto.closing_day;
      }

      if (updateCreditCardDto.due_day !== undefined) {
        updateData.due_day = updateCreditCardDto.due_day;
      }

      // Update data JSON field if any data fields changed
      if (
        updateCreditCardDto.brand !== undefined ||
        updateCreditCardDto.network !== undefined ||
        updateCreditCardDto.color !== undefined
      ) {
        const currentData = existingCard.data
          ? typeof existingCard.data === 'string'
            ? JSON.parse(existingCard.data)
            : existingCard.data
          : {};

        const newData: CreditCardData = {
          ...currentData,
          ...(updateCreditCardDto.brand && { brand: updateCreditCardDto.brand }),
          ...(updateCreditCardDto.network && { network: updateCreditCardDto.network }),
          ...(updateCreditCardDto.color && { color: updateCreditCardDto.color }),
        };
        updateData.data = JSON.stringify(newData);
      }

      const document = await this.dbAdapter.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CREDIT_CARDS,
        creditCardId,
        updateData,
      );

      return this.deserializeCreditCard(document);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update credit card: ${error.message}`);
    }
  }

  /**
   * Delete a credit card
   */
  async deleteCreditCard(creditCardId: string): Promise<void> {
    try {
      // First verify the credit card exists
      await this.getCreditCardById(creditCardId);

      await this.dbAdapter.deleteDocument(DATABASE_ID, COLLECTIONS.CREDIT_CARDS, creditCardId);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete credit card: ${error.message}`);
    }
  }

  /**
   * Update credit card used limit (used by transactions)
   */
  async updateUsedLimit(creditCardId: string, newUsedLimit: number): Promise<CreditCard> {
    try {
      const document = await this.dbAdapter.updateDocument(DATABASE_ID, COLLECTIONS.CREDIT_CARDS, creditCardId, {
        used_limit: newUsedLimit,
        updated_at: new Date().toISOString(),
      });

      return this.deserializeCreditCard(document);
    } catch (error: any) {
      throw new BadRequestException(`Failed to update used limit: ${error.message}`);
    }
  }

  /**
   * Deserialize Appwrite document to CreditCard type
   */
  private deserializeCreditCard(document: any): CreditCard {
    let data: CreditCardData | undefined;

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
      account_id: document.account_id,
      name: document.name,
      last_digits: document.last_digits,
      credit_limit: document.credit_limit,
      used_limit: document.used_limit,
      closing_day: document.closing_day,
      due_day: document.due_day,
      data: data ? JSON.stringify(data) : undefined,
      created_at: document.created_at,
      updated_at: document.updated_at,
    };
  }
}
