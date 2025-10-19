import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { getCorsConfig, getSwaggerConfig } from './config';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = new Logger(AppModule.name);

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  const swaggerDocument = SwaggerModule.createDocument(app, getSwaggerConfig());
  SwaggerModule.setup('/docs', app, swaggerDocument, {
    jsonDocumentUrl: 'openapi.json',
  });

  app.enableCors(getCorsConfig(config));
  app.useGlobalPipes(new ValidationPipe());

  const port = config.getOrThrow<number>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');

  try {
    await app.listen(port);
    logger.log(`Server is running at: ${host}`);
  } catch (error) {
    logger.error(`FAILED to start: ${error.message}`);
    process.exit(1);
  }
}
bootstrap();
