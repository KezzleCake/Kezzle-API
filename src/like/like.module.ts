import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { Cake, CakeSchema } from 'src/cake/entities/cake.schema';
import { Store, StoreSchema } from 'src/store/entities/store.schema';
import { CakeModule } from './../cake/cake.module';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/store/store.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Cake.name, schema: CakeSchema }],
      'kezzle',
    ),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'kezzle',
    ),
    MongooseModule.forFeature(
      [{ name: Store.name, schema: StoreSchema }],
      'kezzle',
    ),
    CakeModule,
    UserModule,
    StoreModule,
    LogModule,
  ],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
