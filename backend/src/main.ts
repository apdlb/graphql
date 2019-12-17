import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppModule } from './app.module';
import logger from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.use(morgan('dev'));
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );
  const APP_PORT = process.env.APP_PORT || 3000;
  const APP_HOST = process.env.APP_HOST || '0.0.0.0';
  await app.listen(APP_PORT, APP_HOST, () => {
    logger.info(`Server started at http://${APP_HOST}:${APP_PORT}`);
  });
}
bootstrap();
