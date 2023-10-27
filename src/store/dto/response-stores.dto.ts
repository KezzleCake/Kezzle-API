import { ApiProperty } from '@nestjs/swagger';
import { StoreResponseDto } from './response-store.dto';

export class StoresResponseDto {
  @ApiProperty({
    type: Boolean,
    description: '데이터가 더 있는가',
    example: true,
  })
  readonly hasMore: boolean;

  @ApiProperty({
    type: [StoreResponseDto],
    description: '스토어들',
  })
  readonly stores: StoreResponseDto[];

  constructor(data: any, more: boolean) {
    this.hasMore = more;
    this.stores = data;
  }
}
