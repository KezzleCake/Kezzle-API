import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import IUser from 'src/user/interfaces/user.interface';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
    private readonly userService: UserService,
  ) {}

  //이건 업로드 기능이 없기 때문에 추후 개발
  async create(createCakeDto: CreateCakeDto): Promise<Cake> {
    const createdUser = new this.cakeModel(createCakeDto);
    return createdUser.save();
  }

  async findAll(): Promise<Cake[]> {
    return this.cakeModel.find().exec();
  }

  async findOne(cakeid: string): Promise<Cake> {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return cake;
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  async changeContent(cakeid: string, updateData: UpdateCakeDto) {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      // updateData에 있는 값을 cake 객체에 적용합니다.
      cake.image = updateData.image;
      // 변경된 내용을 저장&반환
      return cake.save();
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  async removeContent(cakeid: string) {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return cake.deleteOne();
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  async addLikeList(cakeId: string, user: IUser) {
    const cake = await this.cakeModel.findById(cakeId);
    if (!cake) {
      throw new Error('케이크를 찾을 수 없습니다.');
    }
    const userId = user.firebaseUid;
    if (!cake.user_like_ids.includes(userId)) {
      cake.user_like_ids.push(userId);
      await cake.save();
    } else throw new Error('이미 좋아요를 누른 케이크입니다');
    // 위에 처럼 이미 누른것에 대한 처리를 에러로 해야하나..? 앱에 그냥 팝업으로 살짝 알려주지 않나?

    await this.userService.addLikeListToUser(userId, cakeId);
    return cake;
  }

  async removeLikeList(cakeId: string, user: IUser) {
    const cake = await this.cakeModel.findById(cakeId);
    if (!cake) {
      throw new Error('케이크를 찾을 수 없습니다.');
    }
    const userId = user.firebaseUid;
    const idx = cake.user_like_ids.indexOf(userId);
    if (idx !== -1) {
      cake.user_like_ids.splice(idx);
    }
    await cake.save();
    return cake;
  }
}
