import { Image } from '../../upload/entities/image.Schema';
import { ApiProperty } from '@nestjs/swagger';
import { CakesResponseDto } from 'src/cake/dto/response-cakes.dto';

export class StoreResponseDto {
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
    type: Image,
    description: '케이크 매장 로고 사진',
    required: false,
  })
  readonly logo: Image;

  @ApiProperty({
    description: '케이크 매장 주소',
  })
  readonly address: string;

  @ApiProperty({
    type: Boolean,
    description: '로그인한 유저가 좋아요 눌렀는지',
    example: true,
  })
  readonly isLiked: boolean;

  @ApiProperty({
    description: '매장에서 유저가 설정한 위치와 거리',
    example: '12041.93542697711 == 12.041(km)',
  })
  readonly distance: string;

  @ApiProperty({
    type: CakesResponseDto,
    description: '매장에서 가지고 있는 케이크들',
  })
  readonly cakes: CakesResponseDto;

  constructor(data: any, userid: string, cakes: CakesResponseDto) {
    this._id = data?._id;
    this.name = data?.name;
    this.logo = data?.logo;
    this.address = data?.address;
    this.isLiked = data?.user_like_ids.includes(userid);
    this.distance = data?.distance;
    this.cakes = cakes;
  }
}
