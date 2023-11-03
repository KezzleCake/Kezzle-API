import { AnniversaryDto } from 'src/anniversary/dto/response-anniversary.dto';
import { PopularCakesResponseDto } from 'src/cake/dto/response-popular-cakes.dto';
import { RankResponseDto } from 'src/search/dto/response-search-rank.dto';
import { CurationDtoV2 } from './response-curation.dto.v2';
import { CakesSimpleResponseDto } from 'src/cake/dto/response-cakes-simple.dto';
import { CakeSimpleResponseDto } from 'src/cake/dto/response-cake-simple.dto';

export class HomeCurationDtoV2 {
  readonly recommendCakes: CakeSimpleResponseDto[];
  readonly anniversary: AnniversaryDto;
  readonly popularCakes: PopularCakesResponseDto;
  readonly keywordRanks: RankResponseDto;
  readonly newestCakes: CakesSimpleResponseDto;
  readonly curations: CurationDtoV2[];

  constructor(
    recommendCakes: CakeSimpleResponseDto[],
    anniversary: AnniversaryDto,
    popularCakes: PopularCakesResponseDto,
    keywordRanks: RankResponseDto,
    newestCakes: CakesSimpleResponseDto,
    curations: CurationDtoV2[],
  ) {
    this.recommendCakes = recommendCakes;
    this.anniversary = anniversary;
    this.popularCakes = popularCakes;
    this.keywordRanks = keywordRanks;
    this.newestCakes = newestCakes;
    this.curations = curations;
  }
}
