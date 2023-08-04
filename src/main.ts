import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import * as AWS from 'aws-sdk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

AWS.config.update({
  region: process.env.A_REGION,
  accessKeyId: process.env.A_ACCESS_KEY_ID,
  secretAccessKey: process.env.A_SECRET_ACCESS_KEY,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kezzle API')
    .setDescription('The Kezzle API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  await app.listen(3000);
}
bootstrap();
