import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cake, CakeSchema } from './entities/cake.schema';
import { CakeService } from './cake.service';
import { CakeController } from './cake.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cake.name, schema: CakeSchema }]),
  ],
  controllers: [CakeController],
  providers: [CakeService],
})
export class CakeModule {}
