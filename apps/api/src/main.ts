import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('VitalPathAI');

  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    throw new Error(
      'FRONTEND_URL must be set in production. Set it to the exact frontend origin (e.g. https://vitalpath.onrender.com).',
    );
  }

  app.use(helmet());

  app.use(cookieParser());

  app.enableCors({
    origin:
      process.env.WEB_ORIGIN ||
      process.env.FRONTEND_URL ||
      'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-client-platform'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('VitalPath AI API')
    .setDescription(
      'VitalPath AI — pilot REST API. Full controller coverage as of Sprint 4 post-pilot hardening.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .addTag('auth', 'Authentication and registration')
    .addTag('appointment', 'Citas (appointments)')
    .addTag('stats', 'Aggregated reports')
    .addTag('health', 'Liveness probe')
    .addTag('ai', 'AI chat (Groq) + voice transcription')
    .addTag('medications', 'Patient medication CRUD')
    .addTag('hospitals', 'Healthcare centers and doctor invites')
    .addTag('storage', 'File upload (Supabase) and medical results')
    .addTag('mood', 'Daily mood check-in')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${process.env.PORT}`);
}
bootstrap();
