import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeAppwrite } from './appwrite.client';

@Global()
@Module({
  providers: [
    {
      provide: 'APPWRITE',
      useFactory: (configService: ConfigService) => {
        // Ensure environment variables are loaded
        const endpoint = configService.get<string>('APPWRITE_ENDPOINT');
        const projectId = configService.get<string>('APPWRITE_PROJECT_ID');
        const apiKey = configService.get<string>('APPWRITE_API_KEY');

        if (!endpoint || !projectId || !apiKey) {
          console.warn('⚠️  Appwrite configuration incomplete. Check your .env.local file.');
          return null;
        }

        return initializeAppwrite();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['APPWRITE'],
})
export class AppwriteModule {}
