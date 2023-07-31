import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cake } from 'src/cake/entities/cake.schema';
import { User } from 'src/user/entities/user.schema';
import IUser from 'src/user/interfaces/user.interface';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
  ) {}

  async findUserLikeCake(userid: string) {
    try {
      const user = await this.userModel.findOne({
        firebaseUid: userid,
      });
      if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      const cake = await this.cakeModel.find({
        _id: { $in: user.cake_like_ids },
      });

      return cake;
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }

  async addLikeList(cakeId: string, user: IUser) {
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
  }

  async removeLikeList(cakeId: string, user: IUser) {
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
  }
}
