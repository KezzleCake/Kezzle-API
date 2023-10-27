import { CakeResponseDto } from './response-cake.dto';

export class CakesSearchResponseDto {
  readonly hasMore: boolean;
  readonly nextPage: number;
  readonly cakes: CakeResponseDto[];

  constructor(data: any, nextPage: number, more: boolean) {
    this.hasMore = !more;
    this.nextPage = nextPage;
    this.cakes = data;
  }
}
