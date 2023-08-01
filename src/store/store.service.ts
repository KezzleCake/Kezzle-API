import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './entities/store.schema';
import { Model } from 'mongoose';
import { Cake } from 'src/cake/entities/cake.schema';
import { DetailStoreResponseDto } from './dto/response-detail-store.dto';
import { StoreResponseDto } from './dto/response-store.dto';
import IUser from 'src/user/interfaces/user.interface';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async findAll(user: IUser): Promise<StoreResponseDto[]> {
    const stores = await this.storeModel.find().exec();
    return stores.map((store) => new StoreResponseDto(store, user.firebaseUid));
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return await createdStore.save();
  }

  async findOne(storeid: string): Promise<DetailStoreResponseDto> {
    try {
      const store = await this.storeModel.findById(storeid).exec();
      if (!store) {
        throw new NotFoundException('매장을 찾을 수 없습니다.');
      }
      return new DetailStoreResponseDto(store);
    } catch (error) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }
  }

  //TODO: 소유주 확인 후 진행
  async changeContent(storeid: string, updateData: UpdateStoreDto) {
    try {
      const store = await this.storeModel.findById(storeid).exec();
      if (!store) {
        throw new NotFoundException('매장을 찾을 수 없습니다.');
      }
      return await this.storeModel.updateOne(
        {
          _id: storeid,
        },
        {
          $set: updateData,
        },
      );
    } catch (error) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }
  }

  //TODO: 소유주 확인 후 진행
  async removeContent(storeid: string) {
    try {
      const store = await this.storeModel.findById(storeid).exec();
      if (!store) {
        throw new NotFoundException('매장을 찾을 수 없습니다.');
      }
      return await this.storeModel.deleteOne({ _id: storeid });
    } catch (error) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }
  }
}
