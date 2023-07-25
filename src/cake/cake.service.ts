import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { CreateCakeDto } from './dto/create-cake.dto';

@Injectable()
export class CakeService {
  constructor(@InjectModel(Cake.name) private cakeModel: Model<Cake>) {}

  async create(createCakeDto: CreateCakeDto): Promise<Cake> {
    const createdUser = new this.cakeModel(createCakeDto);
    return createdUser.save();
  }

  async findAll(): Promise<Cake[]> {
    return this.cakeModel.find().exec();
  }
}
