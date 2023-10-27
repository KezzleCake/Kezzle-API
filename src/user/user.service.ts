import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

import { auth } from 'firebase-admin';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found';
import { UserAlredyJoinedException } from './exceptions/user-already-joined.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'kezzle') private userModel: Model<User>,
  ) {}

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
      throw new UserAlredyJoinedException(firebaseUser.uid);
    }

    const createdUser = await new this.userModel({
      ...createUserDto,
      firebaseUid: firebaseUser.uid,
      oauth_provider: firebaseUser.firebase.sign_in_provider,
    });
    return await createdUser.save();
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();

    return users.map((user) => new UserResponseDto(user));
  }

  async findOneByFirebase(userid: string): Promise<UserResponseDto> {
    const user = await this.userModel
      .findOne({
        firebaseUid: userid,
      })
      .catch(() => {
        throw new UserNotFoundException(userid);
      });

    if (user == null) {
      throw new UserNotFoundException(userid);
    }

    return new UserResponseDto(user);
  }

  async changeContent(userid: string, updateData: UpdateUserDto) {
    const user = await this.userModel.findOne({
      firebaseUid: userid,
    });

    if (!user) {
      throw new UserNotFoundException(userid);
    }
    return await this.userModel.updateOne(
      { firebaseUid: userid },
      { $set: updateData },
    );
  }

  //TODO: 회원 탈퇴될때 케이크&스토어 userlikeids에서 유저 정보 삭제
  async removeContent(userid: string) {
    await this.userModel
      .findOne({
        firebaseUid: userid,
      })
      .catch(() => {
        throw new UserNotFoundException(userid);
      });

    return await this.userModel.deleteOne({ firebaseUid: userid });
  }
}
