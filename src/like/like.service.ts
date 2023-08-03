import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CakeService } from 'src/cake/cake.service';
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { Cake } from 'src/cake/entities/cake.schema';
import { CakeAlredyLikeException } from 'src/cake/exceptions/cake-already-like.exception';
import { CakeNotFoundException } from 'src/cake/exceptions/cake-not-found.exception';
import { StoreResponseDto } from 'src/store/dto/response-store.dto';
import { Store } from 'src/store/entities/store.schema';
import { StoreAlredyLikeException } from 'src/store/exceptions/store-already-like.exception';
import { StoreNotFoundException } from 'src/store/exceptions/store-not-found.exception';
import { User } from 'src/user/entities/user.schema';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found';
import IUser from 'src/user/interfaces/user.interface';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly cakeService: CakeService,
  ) {}

  async findUserLikeCake(userid: string): Promise<CakeResponseDto[]> {
    const user = await this.userModel
      .findOne({
        firebaseUid: userid,
      })
      .catch(() => {
        throw new UserNotFoundException(userid);
      });

    const cakes = await this.cakeModel.find({
      _id: { $in: user.cake_like_ids },
    });
    return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
  }
  async findUserLikeStore(
    userid: string,
    Iuser: IUser,
    latitude: number,
    longitude: number,
  ): Promise<StoreResponseDto[]> {
    const user = await this.userModel
      .findOne({
        firebaseUid: userid,
      })
      .catch(() => {
        throw new UserNotFoundException(userid);
      });

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
      {
        $match: {
          user_like_ids: { $in: [userid] },
        },
      },
    ]);

    return Promise.all(
      stores.map(async (store) => {
        const cakes = await this.cakeService.findCake(store._id, Iuser);
        return new StoreResponseDto(store, user.firebaseUid, cakes);
      }),
    );
  }

  async cakeAddLikeList(cakeid: string, user: IUser): Promise<boolean> {
    const cake = await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });

    const userId = user.firebaseUid;
    if (!cake.user_like_ids.includes(userId)) {
      await this.cakeModel.updateOne(
        { _id: cakeid },
        {
          $addToSet: {
            user_like_ids: [userId],
          },
        },
      );
    } else throw new CakeAlredyLikeException(cakeid);

    await this.userModel.updateOne(
      { firebaseUid: userId },
      {
        $addToSet: {
          cake_like_ids: [cakeid],
        },
      },
    );
    return true;
  }

  async cakeRemoveLikeList(cakeid: string, user: IUser): Promise<boolean> {
    await this.cakeModel.findById(cakeid).catch(() => {
      throw new CakeNotFoundException(cakeid);
    });
    const userId = user.firebaseUid;

    await this.cakeModel.updateOne(
      { _id: cakeid },
      { $pull: { user_like_ids: userId } },
    );
    await this.userModel.updateOne(
      { firebaseUid: userId },
      { $pull: { cake_like_ids: cakeid } },
    );
    return true;
  }

  async storeAddLikeList(storeid: string, user: IUser): Promise<boolean> {
    const store = await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });

    const userId = user.firebaseUid;
    if (!store.user_like_ids.includes(userId)) {
      await this.storeModel.updateOne(
        { _id: storeid },
        {
          $addToSet: {
            user_like_ids: [userId],
          },
        },
      );
    } else throw new StoreAlredyLikeException(storeid);

    await this.userModel.updateOne(
      { firebaseUid: userId },
      {
        $addToSet: {
          store_like_ids: [storeid],
        },
      },
    );
    return true;
  }

  async storeRemoveLikeList(storeid: string, user: IUser): Promise<boolean> {
    await this.storeModel.findById(storeid).catch(() => {
      throw new StoreNotFoundException(storeid);
    });
    const userId = user.firebaseUid;

    await this.storeModel.updateOne(
      { _id: storeid },
      { $pull: { user_like_ids: userId } },
    );
    await this.userModel.updateOne(
      { firebaseUid: userId },
      { $pull: { store_like_ids: storeid } },
    );
    return true;
  }
}
