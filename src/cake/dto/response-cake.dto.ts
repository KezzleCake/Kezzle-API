import { ApiProperty } from '@nestjs/swagger';
import { Image } from '../../upload/entities/image.Schema';

export class CakeResponseDto {
  @ApiProperty({
    description: '케이크 ID(ObjectId)',
    example: '60b4d1b3e6b0b3001b9b9b9b',
  })
  readonly _id: string;

  @ApiProperty({ type: Image, description: 'Image' })
  readonly image: Image;

  @ApiProperty({ type: String, description: '케이크 소유 매장 ID(ObjectId)' })
  readonly owner_store_id: string;

  @ApiProperty({
    type: Boolean,
    description: '로그인한 유저가 좋아요 눌렀는지',
    example: true,
  })
  readonly isLiked: boolean;

  @ApiProperty({
    type: String,
    description: 'cursor',
    example: '0123456789',
  })
  readonly cursor: string;

  @ApiProperty({
    description: 'hashtag',
    example: ['케이크', '초코'],
  })
  readonly hashtag: string[];

  constructor(data: any, userid: string) {
    this._id = data?._id;
    this.image = data?.image;
    this.owner_store_id = data?.owner_store_id;
    this.isLiked = data?.user_like_ids.includes(userid);
    this.cursor = data?.cursor;
    this.hashtag = data?.tag_ins;
  }
}
