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
import { UserResponseDto } from './dto/user-response';
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

    const createdUser = new this.userModel({
      ...createUserDto,
      firebaseUid: firebaseUser.uid,
      oauth_provider: firebaseUser.firebase.sign_in_provider,
      username: firebaseUser.name,
    });
    return await createdUser.save();
  }

  //TODO: 나중에 싹다 return DTO로 바꿔야함
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();

    return users.map((x) => new UserResponseDto(x));
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
      user.nickname = updateData.nickname;
      // 변경된 내용을 저장&반환
      return user.save();
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
      return user.deleteOne();
    } catch (error) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }
}
