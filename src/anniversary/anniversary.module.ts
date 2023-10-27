import { Module } from '@nestjs/common';
import { AnniversaryService } from './anniversary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Anniversary, AnniversarySchema } from './entities/anniversary.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Anniversary.name, schema: AnniversarySchema }],
      'kezzle',
    ),
    HttpModule,
  ],
  providers: [AnniversaryService],
  exports: [AnniversaryService],
})
export class AnniversaryModule {}
