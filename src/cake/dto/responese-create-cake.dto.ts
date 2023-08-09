import { ApiProperty } from '@nestjs/swagger';
import { ImageRequestDto } from '../../upload/dto/Image-request.dto';

export class CakeCreateResponseDto {
  @ApiProperty({
    description: '케이크 ID(ObjectId)',
    example: '60b4d1b3e6b0b3001b9b9b9b',
  })
  readonly _id: string;

  @ApiProperty({ type: ImageRequestDto, description: 'ImageRequestDto' })
  readonly ImageRequestDto: ImageRequestDto;

  @ApiProperty({ type: String, description: '케이크 소유 매장 ID(ObjectId)' })
  readonly owner_store_id: string;

  constructor(data: any) {
    this._id = data?._id;
    this.ImageRequestDto = data?.ImageRequestDto;
    this.owner_store_id = data?.owner_store_id;
  }
}
