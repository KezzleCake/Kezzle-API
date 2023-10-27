import { ApiProperty } from '@nestjs/swagger';

export class StoreSimpleResponseDto {
  @ApiProperty({
    description: '케이크 매장 ID(ObjectId)',
    example: '60b4d1b3e6b0b3001b9b9b9b',
  })
  readonly _id: string;

  @ApiProperty({
    description: '케이크 매장명',
  })
  readonly name: string;

  @ApiProperty({
    description: '케이크 매장 주소',
  })
  readonly address: string;

  @ApiProperty({
    type: String,
    description: '매장이 소유한 케이크 맛 ',
    example: '[초코, 딸기, 당근]',
  })
  readonly taste: string[];

  @ApiProperty({
    type: String,
    description: '케이크 매장 위도 경도',
  })
  readonly longitude: string;

  @ApiProperty({
    type: String,
    description: '케이크 매장 위도 경도',
  })
  readonly latitude: string;

  constructor(data: any) {
    this._id = data?._id;
    this.name = data?.name;
    this.address = data?.address;
    this.taste = data?.taste;
    this.longitude = data?.longitude;
    this.latitude = data?.latitude;
  }
}
