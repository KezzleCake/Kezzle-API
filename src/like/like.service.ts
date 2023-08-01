import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { Cake } from 'src/cake/entities/cake.schema';
import { StoreResponseDto } from 'src/store/dto/response-store.dto';
import { Store } from 'src/store/entities/store.schema';
import { User } from 'src/user/entities/user.schema';
import IUser from 'src/user/interfaces/user.interface';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async findUserLikeCake(userid: string): Promise<CakeResponseDto[]> {
    try {
      const user = await this.userModel.findOne({
        firebaseUid: userid,
      });
      if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      const cakes = await this.cakeModel.find({
        _id: { $in: user.cake_like_ids },
      });
      return cakes.map((cake) => new CakeResponseDto(cake, user.firebaseUid));
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }

  async findUserLikeStore(userid: string): Promise<StoreResponseDto[]> {
    try {
      const user = await this.userModel.findOne({
        firebaseUid: userid,
      });
      if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      const stores = await this.storeModel.find({
        _id: { $in: user.store_like_ids },
      });
      return stores.map((store) => new StoreResponseDto(store, userid));
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }

  async cakeAddLikeList(cakeId: string, user: IUser): Promise<boolean> {
    const cake = await this.cakeModel.findById(cakeId);
    if (!cake) {
      throw new Error('케이크를 찾을 수 없습니다.');
    }

    const userId = user.firebaseUid;
    if (!cake.user_like_ids.includes(userId)) {
      await this.cakeModel.updateOne(
        { _id: cakeId },
        {
          $addToSet: {
            user_like_ids: [userId],
          },
        },
      );
    } else throw new Error('이미 좋아요를 누른 케이크입니다');

    await this.userModel.updateOne(
      { firebaseUid: userId },
      {
        $addToSet: {
          cake_like_ids: [cakeId],
        },
      },
    );
    return true;
  }

  async cakeRemoveLikeList(cakeId: string, user: IUser): Promise<boolean> {
    const cake = await this.cakeModel.findById(cakeId);
    if (!cake) {
      throw new Error('케이크를 찾을 수 없습니다.');
    }
    const userId = user.firebaseUid;

    await this.cakeModel.updateOne(
      { _id: cakeId },
      { $pull: { user_like_ids: userId } },
    );
    await this.userModel.updateOne(
      { firebaseUid: userId },
      { $pull: { cake_like_ids: cakeId } },
    );
    return true;
  }

  async storeAddLikeList(storeId: string, user: IUser): Promise<boolean> {
    const store = await this.storeModel.findById(storeId);
    if (!store) {
      throw new Error('매장을 찾을 수 없습니다.');
    }

    const userId = user.firebaseUid;
    if (!store.user_like_ids.includes(userId)) {
      await this.storeModel.updateOne(
        { _id: storeId },
        {
          $addToSet: {
            user_like_ids: [userId],
          },
        },
      );
    } else throw new Error('이미 좋아요를 누른 매장입니다');

    await this.userModel.updateOne(
      { firebaseUid: userId },
      {
        $addToSet: {
          store_like_ids: [storeId],
        },
      },
    );
    return true;
  }

  async storeRemoveLikeList(storeId: string, user: IUser): Promise<boolean> {
    const store = await this.storeModel.findById(storeId).exec();
    if (!store) {
      throw new NotFoundException('매장을 찾을 수 없습니다.');
    }
    const userId = user.firebaseUid;

    await this.storeModel.updateOne(
      { _id: storeId },
      { $pull: { user_like_ids: userId } },
    );
    await this.userModel.updateOne(
      { firebaseUid: userId },
      { $pull: { store_like_ids: storeId } },
    );
    return true;
  }
}
