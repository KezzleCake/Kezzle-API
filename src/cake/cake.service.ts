import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
  ) {}

  //이건 업로드 기능이 없기 때문에 추후 개발
  async create(createCakeDto: CreateCakeDto): Promise<Cake> {
    const createdUser = new this.cakeModel(createCakeDto);
    return await createdUser.save();
  }

  async findAll(): Promise<Cake[]> {
    return await this.cakeModel.find().exec();
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

  //TODO: 수정 요청하는 사람이 정말 소유주인지 확인하기
  async changeContent(cakeid: string, updateData: UpdateCakeDto) {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return await this.cakeModel.updateOne(
        {
          _id: cakeid,
        },
        {
          $set: updateData.image,
        },
      );
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
}
