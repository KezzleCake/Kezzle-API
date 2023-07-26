import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async addLikeListToUser(userId: string, cakeId: string) {
    const user = await this.userModel.findById(userId);
    console.log('user');
    if (!user) {
      throw new Error('User not found');
    }
    console.log('user1');

    if (!user.cake_like_ids.includes(cakeId)) {
      console.log('user2');
      user.cake_like_ids.push(cakeId);
      console.log(user);
      await user.save();
    }

    return user;
  }
}
