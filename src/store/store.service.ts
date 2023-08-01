import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './entities/store.schema';
import { Model } from 'mongoose';
import { Cake } from 'src/cake/entities/cake.schema';
import { CreateCakeDto } from 'src/cake/dto/create-cake.dto';
import { StoreResponseDto } from './dto/response-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return await createdStore.save();
  }

  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.storeModel.find().exec();
    return stores.map((store) => new StoreResponseDto(store));
  }

  async findOne(storeid: string): Promise<StoreResponseDto> {
    try {
      const store = await this.storeModel.findById(storeid).exec();
      if (!store) {
        throw new NotFoundException('매장을 찾을 수 없습니다.');
      }
      return new StoreResponseDto(store);
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

  async createCake(createCakeDto: CreateCakeDto, storeId): Promise<Cake> {
    const createdStore = new this.cakeModel({
      ...createCakeDto,
      owner_store_id: storeId,
    });
    return await createdStore.save();
  }

  async findCake(storeId): Promise<CakeResponseDto[]> {
    const store = await this.storeModel.findById(storeId).exec();
    if (!store) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }

    const cakes = await this.cakeModel.find({
      owner_store_id: storeId,
    });
    return cakes.map((cake) => new CakeResponseDto(cake));
  }
}
