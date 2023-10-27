import { AnniversaryDto } from 'src/anniversary/dto/response-anniversary.dto';
import { CurationsDto } from './response-curations.dto';
import { PopularCakesResponseDto } from 'src/cake/dto/response-popular-cakes.dto';

export class HomeCurationDto {
  readonly anniversary: AnniversaryDto;
  readonly popular: PopularCakesResponseDto;
  readonly show: CurationsDto[];

  constructor(data: any, ann, pop) {
    this.anniversary = ann;
    this.popular = pop;
    this.show = data;
  }
}
