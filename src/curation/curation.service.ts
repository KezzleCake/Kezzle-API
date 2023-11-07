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
import { CurationDtoV2 } from './dto/response-curation.dto.v2';
import { AnniversaryDto } from 'src/anniversary/dto/response-anniversary.dto';
import { PopularCakesResponseDto } from 'src/cake/dto/response-popular-cakes.dto';
import { SearchService } from 'src/search/search.service';
import { RankResponseDto } from 'src/search/dto/response-search-rank.dto';
import { HomeCurationDtoV2 } from './dto/response-home-curation.dto.v2';
import { CakesSimpleResponseDto } from 'src/cake/dto/response-cakes-simple.dto';
import IUser from 'src/user/interfaces/user.interface';

@Injectable()
export class CurationService {
  constructor(
    @InjectModel(Curation.name, 'kezzle')
    private readonly curationModel: Model<Curation>,
    private readonly httpService: HttpService,
    private readonly cakeService: CakeService,
    private readonly anniversaryService: AnniversaryService,
    private readonly searchService: SearchService,
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

  async updateCuration(curationId: string) {
    const curation = await this.curationModel.findById(curationId).catch(() => {
      throw new CurationNotFoundException(curationId);
    });

    const apiUrl = `https://api.kezzlecake.com/clip/cakes/ko-search?keyword=${curation.key}&size=100`; // 외부 API의 엔드포인트 URL
    const response = await this.httpService.get(apiUrl).toPromise();
    const cakes = response.data.result;

    curation.cakes = cakes;
    curation.save();
  }

  async homeCuration() {
    const ments = ['상황별 BEST', '받는 사람들을 위한 케이크'];

    const result: CurationsDto[] = [];

    for (const ment of ments) {
      const tmps = await this.curationModel.find({ note: ment });
      const Response = await tmps.map((tmp) => new CurationDto(tmp));
      result.push(new CurationsDto(Response, ment));
    }
    const ann = await this.anniversaryService.getAnniversary();
    const pop = await this.cakeService.popular(NaN, 10);
    return new HomeCurationDto(result, ann, pop);
  }

  async homeCurationV2(user: IUser | undefined): Promise<HomeCurationDtoV2> {
    const recommendCakes: CakeSimpleResponseDto[] =
      await this.cakeService.findAllByRecommend(user);
    const anniversary: AnniversaryDto =
      await this.anniversaryService.getAnniversary();
    const popularCakes: PopularCakesResponseDto =
      await this.cakeService.popular(NaN, 3);
    const keywordRanks: RankResponseDto = await this.searchService.getRank(
      undefined,
      undefined,
      4,
    );
    const newestCakes: CakesSimpleResponseDto =
      await this.cakeService.findAllByNewest(undefined, 4);
    const curations: CurationDtoV2[] = (
      await this.curationModel.find().limit(4)
    ).map((curation) => {
      const threeDaysLater = new Date(curation.updatedAt);
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      const currentDate = new Date();

      if (threeDaysLater < currentDate) {
        this.updateCuration(curation._id.toString());
      }

      return new CurationDtoV2(curation);
    });

    return new HomeCurationDtoV2(
      anniversary,
      recommendCakes,
      popularCakes,
      keywordRanks,
      newestCakes,
      curations,
    );
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
