import { Module } from '@nestjs/common';
import { AppwriteModule } from '../../appwrite/appwrite.module';
import { AppwriteUserService } from './appwrite-user.service';

@Module({
  imports: [AppwriteModule],
  providers: [AppwriteUserService],
  exports: [AppwriteUserService],
})
export class AppwriteUserServiceModule {}
