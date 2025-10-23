// Load environment variables FIRST, before any other imports
import './env-loader';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';

let cachedApp: Express | null = null;

async function createApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ['error', 'warn', 'log'],
  });

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8801',
    'https://*.vercel.app',
    'https://horizon-ai.vercel.app',
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin matches any of our patterns
      const isAllowed = corsOrigins.some((allowedOrigin) => {
        if (allowedOrigin.includes('*')) {
          const regex = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$');
          return regex.test(origin);
        }
        return allowedOrigin === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Middleware
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  // Cache the app for subsequent requests
  cachedApp = expressApp;

  return expressApp;
}

// Export the handler for Vercel
export default async (req: Request, res: Response) => {
  const app = await createApp();
  return app(req, res);
};
