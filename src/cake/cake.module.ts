import { UserService } from './../user/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cake, CakeSchema } from './entities/cake.schema';
import { User, UserSchema } from '../user/entities/user.schema';
import { CakeService } from './cake.service';
import { CakeController } from './cake.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cake.name, schema: CakeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CakeController],
  providers: [CakeService, UserService, UserModule],
})
export class CakeModule {}
