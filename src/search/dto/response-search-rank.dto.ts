import { ApiProperty } from '@nestjs/swagger';

class Ranking {
  @ApiProperty({
    description: '키워드',
    example: '스마일',
  })
  _id: string;
  @ApiProperty({
    description: '키워드',
    example: '30',
  })
  count: number;
}

export class RankResponseDto {
  @ApiProperty({
    description: '키워드 랭킹 목록',
    type: [Ranking],
  })
  readonly ranking: Ranking[];
  @ApiProperty({
    description: '검색 시작 날짜',
    example: '2021-06-01',
  })
  readonly startDate: string;
  @ApiProperty({
    description: '검색 종료 날짜',
    example: '2021-06-30',
  })
  readonly endDate: string;

  constructor(data: any, startDate, endDate) {
    this.ranking = data;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
