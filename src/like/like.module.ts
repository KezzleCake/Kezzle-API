import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { Cake, CakeSchema } from 'src/cake/entities/cake.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cake.name, schema: CakeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
