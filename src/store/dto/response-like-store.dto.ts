import { Image } from '../../upload/entities/image.Schema';
import { ApiProperty } from '@nestjs/swagger';
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';

export class StoreLikeResponseDto {
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
    type: CakeResponseDto,
    description: '매장에서 가지고 있는 케이크들',
  })
  readonly cakes: CakeResponseDto[];

  constructor(data: any, userid: string, cakes: CakeResponseDto[]) {
    this._id = data?._id;
    this.name = data?.name;
    this.logo = data?.logo;
    this.address = data?.address;
    this.isLiked = data?.user_like_ids.includes(userid);
    this.cakes = cakes;
  }
}
