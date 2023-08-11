import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './entities/store.schema';
import { Model } from 'mongoose';
import { DetailStoreResponseDto } from './dto/response-detail-store.dto';
import { StoreResponseDto } from './dto/response-store.dto';
import IUser from 'src/user/interfaces/user.interface';
import { CakeService } from 'src/cake/cake.service';
import { StoreNotFoundException } from './exceptions/store-not-found.exception';
import { StoresNotFoundException } from './exceptions/stores-not-found.exception';
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';
import { Roles } from 'src/user/entities/roles.enum';
import { UploadService } from 'src/upload/upload.service';
import { UpdateStoreLogoDto } from './dto/update-store-logo.dto';
import { S3 } from 'aws-sdk';
import { StoresResponseDto } from './dto/response-stores.dto';

@Injectable()
export class StoreService {
  private s3 = new S3();
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly cakeService: CakeService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(
    user: IUser,
    latitude: number,
    longitude: number,
    after,
    limit: number,
  ) {
    let stores;

    if (stores === undefined) {
      stores = await this.storeModel
        .aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: [127.044811, 37.5038134] },
              distanceField: 'dist',
              spherical: true,
            },
          },
        ])
        .limit(limit + 1)
        .catch(() => {
          throw new StoresNotFoundException();
        });
    } else {
      stores = await this.storeModel
        .aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: [127.044811, 37.5038134] },
              distanceField: 'dist',
              spherical: true,
            },
          },
          {
            $match: {
              dist: {
                $gt: after,
              },
            },
          },
        ])
        .limit(limit + 2)
        .catch(() => {
          throw new StoresNotFoundException();
        });
      stores.shift();
    }

    let hasMore = false;

    if (stores.length > limit) {
      hasMore = true;
      stores = stores.slice(0, stores.length - 1);
    }

    const storeResponse = await Promise.all(
      stores.map(async (store) => {
        const cakes = await this.cakeService.findCake(
          store._id,
          user,
          undefined,
          20,
        );
        return await new StoreResponseDto(store, user.firebaseUid, cakes);
      }),
    );

    return await new StoresResponseDto(storeResponse, hasMore);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return await createdStore.save();
  }

  async findOne(
    storeid: string,
    user: IUser,
    latitude: number,
    longitude: number,
  ): Promise<DetailStoreResponseDto> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    const storeone = await this.storeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          spherical: true,
          distanceField: 'distance',
        },
      },
      {
        $match: {
          _id: store._id,
        },
      },
    ]);

    return new DetailStoreResponseDto(storeone[0], user.firebaseUid);
  }

  async changeContent(
    storeid: string,
    updateData: UpdateStoreDto,
    user: IUser,
  ) {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    return await this.storeModel.updateOne(
      {
        _id: storeid,
      },
      {
        $set: updateData,
      },
    );
  }

  async removeContent(storeid: string, user: IUser) {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });
    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }
    return await this.storeModel.deleteOne({ _id: storeid });
  }

  async changeLogo(storeid: string, user: IUser, file) {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    if (store.logo !== undefined) {
      await this.uploadService.remove('store/logo', store.logo.s3Url);
    }
    const updatedata = new UpdateStoreLogoDto(
      await this.uploadService.create('store/logo', file),
    );

    return await this.storeModel.updateOne(
      {
        _id: storeid,
      },
      {
        $set: updatedata,
      },
    );
  }

  //TODO: 조금있다가 고치기
  // async changeDetailImage(storeid: string, user: IUser, files) {
  //   const params = {
  //     Bucket: process.env.A_BUCKET_NAME,
  //     Key: `store/detailimage`,
  //     Body: files.buffer,
  //     ACL: 'public-read',
  //     ContentType: `image/png`,
  //   };
  //   const data = await this.s3
  //     .upload(params)
  //     .promise()
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
}
