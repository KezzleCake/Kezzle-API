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
    type: Boolean,
    description: 'cursor',
    example: true,
  })
  readonly cursor: string;

  @ApiProperty({
    type: Boolean,
    description: 'like_ins',
    example: true,
  })
  readonly like_ins: string;

  @ApiProperty({
    type: Boolean,
    description: 'tag_ins',
    example: true,
  })
  readonly tag_ins: string;

  @ApiProperty({
    type: Boolean,
    description: 'content_ins',
    example: true,
  })
  readonly content_ins: string;

  constructor(data: any, userid: string) {
    this._id = data?._id;
    this.image = data?.image;
    this.owner_store_id = data?.owner_store_id;
    this.isLiked = data?.user_like_ids.includes(userid);
    this.cursor = data?.cursor;
    this.like_ins = data?.likeins;
    this.tag_ins = data?.tag_ins;
    this.content_ins = data?.content_ins;
  }
}
