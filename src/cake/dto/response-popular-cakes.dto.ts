import { ApiProperty } from '@nestjs/swagger';
import { CakeResponseDto } from './response-cake.dto';

export class PopularCakesResponseDto {
  readonly startDate: string;
  readonly endDate: string;

  @ApiProperty({
    description: '케이크들',
  })
  readonly cakes: CakeResponseDto[];

  constructor(data: any, startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.cakes = data;
  }
}
