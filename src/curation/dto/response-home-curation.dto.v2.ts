import { AnniversaryDto } from 'src/anniversary/dto/response-anniversary.dto';
import { PopularCakesResponseDto } from 'src/cake/dto/response-popular-cakes.dto';
import { RankResponseDto } from 'src/search/dto/response-search-rank.dto';
import { CurationDtoV2 } from './response-curation.dto.v2';
import { CakesSimpleResponseDto } from 'src/cake/dto/response-cakes-simple.dto';
import { CakeSimpleResponseDto } from 'src/cake/dto/response-cake-simple.dto';
import { ApiProperty } from '@nestjs/swagger';

export class HomeCurationDtoV2 {
  @ApiProperty({
    description: '기념일 정보',
    type: AnniversaryDto,
  })
  readonly anniversary: AnniversaryDto;

  @ApiProperty({
    description: '추천 케이크들 6개를 반환합니다.',
    type: [CakeSimpleResponseDto],
  })
  readonly recommendCakes: CakeSimpleResponseDto[];

  @ApiProperty({
    description: '인기 케이크들 3개를 반환합니다.',
    type: PopularCakesResponseDto,
  })
  readonly popularCakes: PopularCakesResponseDto;

  @ApiProperty({
    description: '인기 검색어 4개를 반환합니다.',
    type: RankResponseDto,
  })
  readonly keywordRanks: RankResponseDto;

  @ApiProperty({
    description: '최신 케이크들 4개를 반환합니다.',
    type: CakesSimpleResponseDto,
  })
  readonly newestCakes: CakesSimpleResponseDto;

  @ApiProperty({
    description: '큐레이션 4개를 반환합니다.',
    type: [CurationDtoV2],
  })
  readonly curations: CurationDtoV2[];

  constructor(
    anniversary: AnniversaryDto,
    recommendCakes: CakeSimpleResponseDto[],
    popularCakes: PopularCakesResponseDto,
    keywordRanks: RankResponseDto,
    newestCakes: CakesSimpleResponseDto,
    curations: CurationDtoV2[],
  ) {
    this.anniversary = anniversary;
    this.recommendCakes = recommendCakes;
    this.popularCakes = popularCakes;
    this.keywordRanks = keywordRanks;
    this.newestCakes = newestCakes;
    this.curations = curations;
  }
}
