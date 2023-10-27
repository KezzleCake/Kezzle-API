import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KeywordLog, KeywordLogSchema } from './entities/keywordLog.shema';
import { CakeLikeLog, CakeLikeLogSchema } from './entities/cakeLikeLog.shema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: KeywordLog.name, schema: KeywordLogSchema }],
      'kezzle',
    ),
    MongooseModule.forFeature(
      [{ name: CakeLikeLog.name, schema: CakeLikeLogSchema }],
      'kezzle',
    ),
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
