import { ApiProperty } from '@nestjs/swagger';
import { CakeResponseDto } from './response-cake.dto';

export class PopularCakesResponseDto {
  @ApiProperty({
    description: '시작 날짜',
    example: '2021-06-01',
  })
  readonly startDate: string;

  @ApiProperty({
    description: '종료 날짜',
    example: '2021-06-30',
  })
  readonly endDate: string;

  @ApiProperty({
    description: '케이크들',
    type: [CakeResponseDto],
  })
  readonly cakes: CakeResponseDto[];

  constructor(data: any, startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.cakes = data;
  }
}
