import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { NotFoundException } from '@nestjs/common';
import { CakeResponseDto } from './dto/response-cake.dto';
import IUser from 'src/user/interfaces/user.interface';
import { CreateCakeDto } from './dto/create-cake.dto';
import { Store } from 'src/store/entities/store.schema';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async findAll(user: IUser): Promise<CakeResponseDto[]> {
    const cakes = await this.cakeModel.find().exec();
    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }

  async findOne(cakeid: string, user: IUser): Promise<CakeResponseDto> {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return new CakeResponseDto(cake, user.firebaseUid);
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  //TODO: 소유주 확인 후 진행
  async changeContent(cakeid: string, updateData: UpdateCakeDto) {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return await this.cakeModel.updateOne(
        {
          _id: cakeid,
        },
        {
          $set: updateData,
        },
      );
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  //TODO: 소유주 확인 후 진행
  async removeContent(cakeid: string) {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return await this.cakeModel.deleteOne({ _id: cakeid });
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  async createCake(createCakeDto: CreateCakeDto, storeId): Promise<Cake> {
    const createdStore = new this.cakeModel({
      ...createCakeDto,
      owner_store_id: storeId,
    });
    return await createdStore.save();
  }

  async findCake(storeId, user: IUser): Promise<CakeResponseDto[]> {
    const store = await this.storeModel.findById(storeId).exec();
    if (!store) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }

    const cakes = await this.cakeModel.find({
      owner_store_id: storeId,
    });
    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }
}
