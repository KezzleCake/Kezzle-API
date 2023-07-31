import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../firebase-adminsdk.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
bootstrap();
