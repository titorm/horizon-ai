import { Module } from '@nestjs/common';
import { AppwriteModule } from '../appwrite/appwrite.module';
import { AccountsController } from './controllers/accounts.controller';
import { CreditCardsController } from './controllers/credit-cards.controller';
import { AppwriteAccountService, AppwriteCreditCardService } from './services';
import { AppwriteTransactionService } from './services/appwrite-transaction.service';
import { AppwriteDBAdapter } from '../appwrite/appwrite-db-adapter';

@Module({
  imports: [AppwriteModule],
  controllers: [AccountsController, CreditCardsController],
  providers: [
    AppwriteAccountService,
    AppwriteCreditCardService,
    AppwriteTransactionService,
    {
      provide: AppwriteDBAdapter,
      useFactory: (appwrite: any) => {
        if (!appwrite || !appwrite.databases) {
          throw new Error('Appwrite not properly initialized');
        }
        return new AppwriteDBAdapter(appwrite.databases);
      },
      inject: ['APPWRITE'],
    },
  ],
  exports: [AppwriteAccountService, AppwriteCreditCardService],
})
export class AccountsModule {}
