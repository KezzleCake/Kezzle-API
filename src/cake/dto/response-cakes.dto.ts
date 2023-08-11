import { ApiProperty } from '@nestjs/swagger';
import { CakeResponseDto } from './response-cake.dto';

export class CakesResponseDto {
  @ApiProperty({
    type: Boolean,
    description: '데이터가 더 있는가',
    example: true,
  })
  readonly hasMore: boolean;

  @ApiProperty({
    description: '케이크들',
  })
  readonly cakes: CakeResponseDto[];

  constructor(data: any, more: boolean) {
    this.hasMore = more;
    this.cakes = data;
  }
}
