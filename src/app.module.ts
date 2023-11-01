import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { CakeModule } from './cake/cake.module';
import { AuthModule } from './auth/auth.module';
import { LikeModule } from './like/like.module';
import { StoreModule } from './store/store.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { CurationModule } from './curation/curation.module';
import { LogModule } from './log/log.module';
import { AnniversaryModule } from './anniversary/anniversary.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      user: process.env.MONGODB_USERNAME,
      pass: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DBNAME_MAIN,
      connectionName: 'kezzle',
    }),
    UserModule,
    CakeModule,
    AuthModule,
    LikeModule,
    StoreModule,
    UploadModule,
    SearchModule,
    CurationModule,
    LogModule,
    AnniversaryModule,
    CounterModule,
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
