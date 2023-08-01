import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cake } from './entities/cake.schema';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { NotFoundException } from '@nestjs/common';
import { CakeResponseDto } from './dto/response-cake.dto';

@Injectable()
export class CakeService {
  constructor(
    @InjectModel(Cake.name) private readonly cakeModel: Model<Cake>,
  ) {}

  async findAll(): Promise<CakeResponseDto[]> {
    const cakes = await this.cakeModel.find().exec();
    return cakes.map((cake) => new CakeResponseDto(cake));
  }

  async findOne(cakeid: string): Promise<CakeResponseDto> {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return new CakeResponseDto(cake);
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  //TODO: 소유주 확인 후 진행
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
          $set: updateData,
        },
      );
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }

  //TODO: 소유주 확인 후 진행
  async removeContent(cakeid: string) {
    try {
      const cake = await this.cakeModel.findById(cakeid).exec();
      if (!cake) {
        throw new NotFoundException('케이크를 찾을 수 없습니다.');
      }
      return await this.cakeModel.deleteOne({ _id: cakeid });
    } catch (error) {
      throw new NotFoundException('케이크를 찾을 수 없습니다.');
    }
  }
}
