import { CakesResponseDto } from './dto/response-cakes.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { CakeResponseDto } from './dto/response-cake.dto';
import IUser from 'src/user/interfaces/user.interface';
import { Store } from 'src/store/entities/store.schema';
import { CakeNotFoundException } from './exceptions/cake-not-found.exception';
import { StoreNotFoundException } from 'src/store/exceptions/store-not-found.exception';
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';
import { Roles } from 'src/user/entities/roles.enum';
import { CakeCreateResponseDto } from './dto/responese-create-cake.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(user: IUser, after, limit: number): Promise<CakesResponseDto> {
    let cakes;
    if (after === undefined) {
      cakes = await this.cakeModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
          _id: { $lt: after },
        })
        .sort({ createdAt: -1 })
        .limit(limit + 1);
    }
    let hasMore = false;

    if (cakes.length > limit) {
      hasMore = true;
      cakes = cakes.slice(0, cakes.length - 1);
    }

    const cakeResponse = await cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );
    return new CakesResponseDto(cakeResponse, hasMore);
  }
  async findOne(cakeid: string, user: IUser): Promise<CakeResponseDto> {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    return new CakeResponseDto(cake, user.firebaseUid);
  }

  async changeContent(cakeid: string, user: IUser, file) {
    const cake = await this.cakeModel.findOne({ _id: cakeid }).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    const store = await this.storeModel
      .findById(cake.owner_store_id)
      .catch(() => {
        throw new StoreNotFoundException(cake.owner_store_id);
      });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    await this.uploadService.remove('cake', cake.image.s3Url);

    const updatedata = new UpdateCakeDto(
      await this.uploadService.create('cake', file),
    );
    return await this.cakeModel.updateOne(
      {
        _id: cakeid,
      },
      {
        $set: updatedata,
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
    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    return await this.cakeModel.deleteOne({ _id: cakeid });
  }

  async createCake(storeid, user: IUser, file): Promise<CakeCreateResponseDto> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    //TODO: 이거 나중에 확인해야함

    const path = store.name + '/cakes';
    const image = await this.uploadService.create('path', file);

    const cake = await this.cakeModel.create({
      image: image,
      owner_store_id: storeid,
    });
    return new CakeCreateResponseDto(cake);
  }

  async findCake(
    storeid,
    user: IUser,
    after,
    limit: number,
  ): Promise<CakesResponseDto> {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    let cakes;
    if (after === undefined) {
      cakes = await this.cakeModel
        .find({
          owner_store_id: storeid,
        })
        .sort({ createdAt: -1 })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
          _id: { $lt: after },
          owner_store_id: storeid,
        })
        .sort({ createdAt: -1 })
        .limit(limit + 1);
    }

    let hasMore = false;

    if (cakes.length > limit) {
      hasMore = true;
      cakes = cakes.slice(0, cakes.length - 1);
    }

    const cakeResponse = await cakes.map(
      (cake) => new CakeResponseDto(cake, user.firebaseUid),
    );
    return new CakesResponseDto(cakeResponse, hasMore);
  }

  async findStoreCake(storeid, user: IUser) {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    const cakes = await this.cakeModel
      .find({
        owner_store_id: storeid,
      })
      .sort({ createdAt: -1 })
      .limit(20);

    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }
}
