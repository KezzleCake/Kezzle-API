import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { CakeResponseDto } from './dto/response-cake.dto';
import IUser from 'src/user/interfaces/user.interface';
import { CreateCakeDto } from './dto/create-cake.dto';
import { Store } from 'src/store/entities/store.schema';
import { CakeNotFoundException } from './exceptions/cake-not-found.exception';
import { StoreNotFoundException } from 'src/store/exceptions/store-not-found.exception';
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';

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
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    return new CakeResponseDto(cake, user.firebaseUid);
  }

  async changeContent(cakeid: string, updateData: UpdateCakeDto, user: IUser) {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    const store = await this.storeModel
      .findById(cake.owner_store_id)
      .catch(() => {
        throw new StoreNotFoundException(cake.owner_store_id);
      });

    if (store.owner_user_id !== user.firebaseUid) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    return await this.cakeModel.updateOne(
      {
        _id: cakeid,
      },
      {
        $set: updateData,
      },
    );
  }

  async removeContent(cakeid: string, user: IUser) {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    const store = await this.storeModel
      .findById(cake.owner_store_id)
      .catch(() => {
        throw new StoreNotFoundException(cake.owner_store_id);
      });
    if (store.owner_user_id !== user.firebaseUid) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    return await this.cakeModel.deleteOne({ _id: cakeid });
  }

  async createCake(
    createCakeDto: CreateCakeDto,
    storeid,
    user: IUser,
  ): Promise<Cake> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });
    if (store.owner_user_id !== user.firebaseUid) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    const createdStore = new this.cakeModel({
      ...createCakeDto,
      owner_store_id: storeid,
    });
    return await createdStore.save();
  }

  async findCake(storeid, user: IUser): Promise<CakeResponseDto[]> {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    const cakes = await this.cakeModel.find({
      owner_store_id: storeid,
    });
    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }
}
