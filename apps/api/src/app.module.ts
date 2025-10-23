import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AppwriteModule } from './appwrite/appwrite.module';
import { UserModule } from './users/user.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountsModule } from './database/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Carregar .env da RAIZ DO TURBOREPO (não do /api)
      // Em runtime, __dirname = apps/api/dist/
      // ../../../ vai para a raiz do monorepo onde está o .env.local
      envFilePath: [
        path.resolve(__dirname, '../../../.env.local'),
        path.resolve(__dirname, '../../../.env'),
        path.resolve(__dirname, '../../../.env.example'),
      ],
    }),
    AppwriteModule,
    AuthModule,
    HealthModule,
    UserModule,
    TransactionsModule,
    AccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
