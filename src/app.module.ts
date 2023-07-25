import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { CakeModule } from './cake/cake.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      user: process.env.MONGODB_USERNAME,
      pass: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DBNAME,
    }),
    UserModule,
    CakeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
