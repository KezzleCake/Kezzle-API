import { ApiProperty } from '@nestjs/swagger';
import { Image } from '../../upload/entities/image.Schema';
import { StoreSimpleResponseDto } from 'src/store/dto/response-simple-store.dto';

export class CakeSimilarResponseDto {
  @ApiProperty({
    description: '케이크 ID(ObjectId)',
    example: '60b4d1b3e6b0b3001b9b9b9b',
  })
  readonly _id: string;

  @ApiProperty({ type: Image, description: 'Image' })
  readonly image: Image;

  @ApiProperty({ type: String, description: '케이크 소유 매장 ID(ObjectId)' })
  readonly owner_store_id: string;

  @ApiProperty({ type: String, description: '케이크 소유 매장 이름' })
  readonly owner_store_name: string;

  @ApiProperty({ type: String, description: '케이크 소유 매장 주소' })
  readonly owner_store_address: string;

  @ApiProperty({ type: String, description: '케이크 소유 매장의 맛' })
  readonly owner_store_taste: string[];

  @ApiProperty({ type: String, description: '케이크 소유 매장의 위도' })
  readonly owner_store_latitude: string;

  @ApiProperty({ type: String, description: '케이크 소유 매장의 경도' })
  readonly owner_store_longitude: string;

  constructor(data: any, store: StoreSimpleResponseDto) {
    this._id = data?.id;
    this.image = data?.image;
    this.owner_store_id = data?.owner_store_id;
    this.owner_store_name = store.name;
    this.owner_store_address = store.address;
    this.owner_store_taste = store.taste;
    this.owner_store_latitude = store.latitude;
    this.owner_store_longitude = store.longitude;
  }
}
