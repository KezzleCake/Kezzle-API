import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cake } from 'src/cake/entities/cake.schema';
import { User } from 'src/user/entities/user.schema';

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
}
