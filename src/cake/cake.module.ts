import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cake, CakeSchema } from './entities/cake.schema';
import { CakeService } from './cake.service';
import { CakeController } from './cake.controller';
import { Store, StoreSchema } from 'src/store/entities/store.schema';
import { UploadModule } from '../upload/upload.module';
import { HttpModule } from '@nestjs/axios';
import { StoreModule } from 'src/store/store.module';
import { LogModule } from 'src/log/log.module';
import { AnniversaryModule } from 'src/anniversary/anniversary.module';
import { CounterModule } from 'src/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Cake.name, schema: CakeSchema }],
      'kezzle',
    ),
    MongooseModule.forFeature(
      [{ name: Store.name, schema: StoreSchema }],
      'kezzle',
    ),
    UploadModule,
    HttpModule,
    forwardRef(() => StoreModule),
    LogModule,
    AnniversaryModule,
    CounterModule,
  ],
  controllers: [CakeController],
  providers: [CakeService],
  exports: [CakeService],
})
export class CakeModule {}
