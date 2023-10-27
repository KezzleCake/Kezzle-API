import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './entities/store.schema';
import { Model, PipelineStage } from 'mongoose';
import { DetailStoreResponseDto } from './dto/response-detail-store.dto';
import { StoreResponseDto } from './dto/response-store.dto';
import IUser from 'src/user/interfaces/user.interface';
import { StoreNotFoundException } from './exceptions/store-not-found.exception';
import { StoresNotFoundException } from './exceptions/stores-not-found.exception';
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';
import { Roles } from 'src/user/entities/roles.enum';
import { UploadService } from 'src/upload/upload.service';
import { UpdateStoreLogoDto } from './dto/update-store-logo.dto';
import { S3 } from 'aws-sdk';
import { StoresResponseDto } from './dto/response-stores.dto';
import { UpdateStoreImageDto } from './dto/update-store-image.dto';
import { CakeService } from 'src/cake/cake.service';

@Injectable()
export class StoreService {
  private s3 = new S3();
  constructor(
    @InjectModel(Store.name, 'kezzle')
    private readonly storeModel: Model<Store>,
    @Inject(forwardRef(() => CakeService))
    private readonly cakeService: CakeService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(
    user: IUser,
    latitude: number,
    longitude: number,
    distance: number,
    after: number,
    limit: number,
  ) {
    let stores;

    const geoNear: PipelineStage.GeoNear = {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'dist',
        spherical: true,
      },
    };

    if (!Number.isNaN(distance)) {
      geoNear.$geoNear.maxDistance = distance;
    }

    const match: PipelineStage.Match = {
      $match: {
        dist: {
          $gt: after,
        },
      },
    };

    const pipeline = [geoNear, match];

    if (Number.isNaN(after)) {
      pipeline.pop();
    }
    stores = await this.storeModel
      .aggregate(pipeline)
      .limit(limit + 1)
      .catch(() => {
        throw new StoresNotFoundException();
      });
    let hasMore = false;

    if (stores.length > limit) {
      hasMore = true;
      stores = stores.slice(0, stores.length - 1);
    }

    const storeResponse = await Promise.all(
      stores.map(async (store) => {
        const cakes = await this.cakeService.findStoreCake(store._id, user);
        return await new StoreResponseDto(store, user.firebaseUid, cakes);
      }),
    );

    return await new StoresResponseDto(storeResponse, hasMore);
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const createdStore = new this.storeModel(createStoreDto);
    return await createdStore.save();
  }

  async findOne(storeid: string, user: IUser): Promise<DetailStoreResponseDto> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });
    return new DetailStoreResponseDto(store, user.firebaseUid);
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

    const path = store.name + '/logo';

    if (store.logo !== undefined) {
      await this.uploadService.remove(path, store.logo.s3Url);
    }
    const updatedata = new UpdateStoreLogoDto(
      await this.uploadService.create(path, file),
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

  async Imageupload(storeid: string, user: IUser, file) {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    const path = store.name + '/detail';

    const updatedata = new UpdateStoreImageDto(
      await this.uploadService.create(path, file),
      store.detail_images,
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

  async Imageremove(storeid: string, user: IUser, fileIdx: number) {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    if (
      store.owner_user_id !== user.firebaseUid &&
      !user.roles.includes(Roles.ADMIN)
    ) {
      throw new UserNotOwnerException(user.firebaseUid, store.owner_user_id);
    }

    const path = store.name + '/detail';

    const deleteData = store.detail_images.splice(fileIdx, 1);
    await this.uploadService.remove(path, deleteData[0].s3Url);

    return await this.storeModel.updateOne(
      {
        _id: storeid,
      },
      {
        $set: store,
      },
    );
  }
}
