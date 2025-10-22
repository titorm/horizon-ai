import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppwriteUserServiceModule } from '../database/services/appwrite-user.service.module';

@Module({
  imports: [AppwriteUserServiceModule],
  controllers: [UserController],
})
export class UserModule {}
