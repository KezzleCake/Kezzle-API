import { Module } from '@nestjs/common';
import { CurationController } from './curation.controller';
import { CurationService } from './curation.service';
import { Curation, CurationSchema } from './entities/curation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AnniversaryModule } from 'src/anniversary/anniversary.module';
import { LogModule } from 'src/log/log.module';
import { CakeModule } from 'src/cake/cake.module';
import { SearchModule } from 'src/search/search.module';
import { CurationControllerV2 } from './curation.controller.v2';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Curation.name, schema: CurationSchema }],
      'kezzle',
    ),
    HttpModule,
    AnniversaryModule,
    LogModule,
    CakeModule,
    SearchModule,
  ],
  controllers: [CurationController, CurationControllerV2],
  providers: [CurationService],
})
export class CurationModule {}
