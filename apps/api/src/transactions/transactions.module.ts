import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { AppwriteTransactionServiceModule } from '../database/services/appwrite-transaction.service.module';

@Module({
  imports: [AppwriteTransactionServiceModule],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
