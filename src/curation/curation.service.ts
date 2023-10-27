import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Curation } from './entities/curation.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { CurationDto } from './dto/response-curation.dto';
import { CurationsDto } from './dto/response-curations.dto';
import { HomeCurationDto } from './dto/response-home-curation.dto';
import { CurationNotFoundException } from './exceptions/curation-not-found.exception';
import { CurationCakeResponsDto } from './dto/response-curation-cake.dto';
import { AnniversaryService } from 'src/anniversary/anniversary.service';
import { CakeService } from 'src/cake/cake.service';
import { CakeSimpleResponseDto } from 'src/cake/dto/response-cake-simple.dto';

@Injectable()
export class CurationService {
  constructor(
    @InjectModel(Curation.name, 'kezzle')
    private readonly curationModel: Model<Curation>,
    private readonly httpService: HttpService,
    private readonly cakeService: CakeService,
    private readonly anniversaryService: AnniversaryService,
  ) {}
  async createCuration(keyword: string, disc: string, note: string) {
    const apiUrl = `https://api.kezzlecake.com/clip/cakes/ko-search?keyword=${keyword}&size=100`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;

    return await this.curationModel.create({
      cakes: cakes,
      description: disc,
      key: keyword,
      note: note,
    });
  }

  async homeCuration(after, limit: number) {
    const ments = ['상황별 BEST', '받는 사람들을 위한 케이크'];

    const result: CurationsDto[] = [];

    for (const ment of ments) {
      const tmps = await this.curationModel.find({ note: ment });
      const Response = await tmps.map((tmp) => new CurationDto(tmp));
      result.push(new CurationsDto(Response, ment));
    }
    const ann = await this.anniversaryService.getAnniversary();
    const pop = await this.cakeService.popular(after, limit);
    return new HomeCurationDto(result, ann, pop);
  }

  async showCuration(curationId: string, page: number) {
    const curation = await this.curationModel.findById(curationId).catch(() => {
      throw new CurationNotFoundException(curationId);
    });

    if (Number.isNaN(page)) page = 0;
    const apiUrl = `https://api.kezzlecake.com/clip/cakes/ko-search-page?keyword=${curation.key}&size=20&page=${page}`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;

    const Response = await cakes.map((cake) => new CakeSimpleResponseDto(cake));
    return new CurationCakeResponsDto(curation.description, Response);
  }
}
