import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cake, CakeSchema } from './entities/cake.schema';
import { CakeService } from './cake.service';
import { CakeController } from './cake.controller';
import { Store, StoreSchema } from 'src/store/entities/store.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cake.name, schema: CakeSchema }]),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    UploadModule,
  ],
  controllers: [CakeController],
  providers: [CakeService],
  exports: [CakeService],
})
export class CakeModule {}
