import { Module } from '@nestjs/common';
import { AppwriteTransactionService } from './appwrite-transaction.service';
import { AppwriteModule } from '../../appwrite/appwrite.module';

@Module({
  imports: [AppwriteModule],
  providers: [AppwriteTransactionService],
  exports: [AppwriteTransactionService],
})
export class AppwriteTransactionServiceModule {}
