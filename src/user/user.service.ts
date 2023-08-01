import { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

import { auth } from 'firebase-admin';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(token: string, createUserDto: CreateUserDto): Promise<User> {
    token = token.replace('Bearer ', '');

    const firebaseUser: any = await auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });

    const user = await this.userModel.findOne({
      firebaseUid: firebaseUser.uid,
    });

    if (user) {
      //TODO:이미 가입된 사람은 저장거절
      throw new Error('User already joined');
    }

    const createdUser = await new this.userModel({
      ...createUserDto,
      firebaseUid: firebaseUser.uid,
      oauth_provider: firebaseUser.firebase.sign_in_provider,
      username: firebaseUser.name,
    });
    return await createdUser.save();
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();

    return users.map((user) => new UserResponseDto(user));
  }

  async findOneByFirebase(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({
      firebaseUid: id,
    });
    return new UserResponseDto(user);
  }

  async changeContent(userid: string, updateData: UpdateUserDto) {
    try {
      const user = await this.userModel.findOne({
        firebaseUid: userid,
      });

      if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }
      return await this.userModel.updateOne(
        { firebaseUid: userid },
        { $set: updateData },
      );
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }

  async removeContent(userid: string) {
    try {
      const user = await this.userModel.findOne({
        firebaseUid: userid,
      });
      if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }
      return await this.userModel.deleteOne({ firebaseUid: userid });
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }
}
