import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Anniversary } from './entities/anniversary.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { AnniversaryDto } from './dto/response-anniversary.dto';

@Injectable()
export class AnniversaryService {
  constructor(
    @InjectModel(Anniversary.name, 'kezzle')
    private readonly AnniversaryModel: Model<Anniversary>,
    private readonly httpService: HttpService,
  ) {}

  async getAnniversaryWord(id: string) {
    return await this.AnniversaryModel.findById(id);
  }

  async getAnniversary() {
    const nowDate = new Date();
    const anniversary = await this.AnniversaryModel.find({
      date: { $gte: nowDate },
    })
      .sort({
        date: 1,
      })
      .limit(1);
    const keyword = anniversary[0].keyword.join(', ');
    const apiUrl = `https://api.kezzlecake.com/clip/cakes/ko-search?keyword=${keyword}&size=6`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;

    const images = [];
    for (const cake of cakes) {
      images.push(cake.image.s3Url);
    }
    const now = new Date();
    const day =
      Math.abs(now.getTime() - anniversary[0].date.getTime()) /
      (1000 * 60 * 60 * 24);
    return new AnniversaryDto(anniversary[0], images, Math.floor(day));
  }
}
