import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CakeService {
  constructor(@InjectModel(Cake.name) private cakeModel: Model<Cake>) {}

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
}
