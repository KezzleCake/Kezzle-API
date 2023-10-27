import { Module, forwardRef } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './entities/store.schema';
import { UploadModule } from 'src/upload/upload.module';
import { CakeModule } from 'src/cake/cake.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Store.name, schema: StoreSchema }],
      'kezzle',
    ),
    forwardRef(() => CakeModule),
    UploadModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
