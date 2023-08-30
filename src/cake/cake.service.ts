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
import { UploadService } from 'src/upload/upload.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(user: IUser, after, limit: number): Promise<CakesResponseDto> {
    let cakes;
    limit = 5;
    if (after === undefined) {
      cakes = await this.cakeModel
        .find()
        .sort({ cursor: 1 })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
          cursor: { $gt: after },
        })
        .sort({ cursor: 1 })
        .limit(limit)
        .exec();
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
  // async findAll(user: IUser, after, limit: number): Promise<CakesResponseDto> {
  //   let cakes;
  //   if (after === undefined) {
  //     cakes = await this.cakeModel.find().limit(limit + 1);
  //   } else {
  //     cakes = await this.cakeModel
  //       .find({
  //         _id: { $gt: after },
  //       })
  //       .limit(limit + 1);
  //   }
  //   let hasMore = false;
  //   if (cakes.length > limit) {
  //     hasMore = true;
  //     cakes = cakes.slice(0, cakes.length - 1);
  //   }
  //   const cakeResponse = await cakes.map(
  //     (cake) => new CakeResponseDto(cake, user.firebaseUid),
  //   );
  //   return new CakesResponseDto(cakeResponse, hasMore);
  // }

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

    const path = store.name + '/cakes';

    await this.uploadService.remove(path, cake.image.s3Url);

    const updatedata = new UpdateCakeDto(
      await this.uploadService.create(path, file),
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

    const path = store.name + '/cakes';

    await this.uploadService.remove(path, cake.image.s3Url);

    return await this.cakeModel.deleteOne({ _id: cakeid });
  }

  async createCake(storeid, user: IUser, files) {
    //: Promise<CakeCreateResponseDto> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    const path = store.name + '/cakes';

    const objectId = new ObjectId();
    const timestamp = objectId.getTimestamp();
    const timeValue = timestamp.getTime().toString().padStart(15, '0');

    let cnt = 0;
    for (const file of files) {
      const image = await this.uploadService.create(path, file);

      const randomNum = Math.floor(Math.random() * 10000);
      const cursorValue = String(randomNum).padStart(6, '0') + timeValue;

      await this.cakeModel.create({
        image: image,
        owner_store_id: storeid,
        cursor: cursorValue,
      });
      cnt++;

      if (cnt % 10 == 0) console.log(cnt + '개의 파일 업로드 성공');
    }
    console.log(cnt + '개의 파일 업로드 성공');
    return cnt + '개의 파일 업로드 성공';
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

    if (Number.isNaN(limit)) {
      limit = 20;
    }
    let cakes;
    if (after === undefined) {
      cakes = await this.cakeModel
        .find({
          owner_store_id: storeid,
        })
        .limit(limit + 1);
    } else {
      cakes = await this.cakeModel
        .find({
          _id: { $gt: after },
          owner_store_id: storeid,
        })
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
