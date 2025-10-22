// Load environment variables FIRST, before any other imports
import './env-loader';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev server
    'http://localhost:8801', // Legacy
  ];

  app.enableCors({
    origin: corsOrigins,
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

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Horizon AI API is running on http://localhost:${port}`);

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log('\n🔄 Shutting down gracefully...');
    await app.close();
    console.log('✅ Application closed');
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
