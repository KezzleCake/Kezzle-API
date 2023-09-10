import { ApiProperty } from '@nestjs/swagger';
import { CakeResponseDto } from './response-cake.dto';

export class CakesCurationDto {
  @ApiProperty({
    description: '키워드',
  })
  readonly keyword: string;

  @ApiProperty({
    description: '케이크들',
  })
  readonly cakes: CakeResponseDto[];

  constructor(data: any, keyword: string) {
    this.keyword = keyword;
    this.cakes = data;
  }
}
