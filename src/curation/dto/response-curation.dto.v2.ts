import { ApiProperty } from '@nestjs/swagger';

export class CurationDtoV2 {
  @ApiProperty({
    description: '큐레이션 id',
  })
  readonly _id: string;

  @ApiProperty({
    description: '큐레이션에 관련한 사진들 url',
  })
  readonly imageUrls: string[];

  @ApiProperty({
    description: '큐레이션 문구',
  })
  readonly description: string;

  constructor(data: any) {
    this._id = data._id;
    this.imageUrls = data?.cakes
      .map((cake) => cake.image.s3Url || [])
      .slice(0, 6);
    this.description = data?.key;
  }
}
