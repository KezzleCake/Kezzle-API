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
import { UserNotOwnerException } from 'src/user/exceptions/user-not-owner.exception';
import { Roles } from 'src/user/entities/roles.enum';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly cakeService: CakeService,
  ) {}

  async findAll(
    user: IUser,
    latitude: number,
    longitude: number,
  ): Promise<StoreResponseDto[]> {
    const stores = await this.storeModel.aggregate([
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
    ]);
    return Promise.all(
      stores.map(async (store) => {
        const cakes = await this.cakeService.findCake(store._id, user);
        return new StoreResponseDto(store, user.firebaseUid, cakes);
      }),
    );
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
}
