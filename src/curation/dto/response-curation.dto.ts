import { ApiProperty } from '@nestjs/swagger';

export class CurationDto {
  @ApiProperty({
    description: '큐레이션 id',
  })
  readonly _id: string;

  @ApiProperty({
    description: '큐레이션의 대표 사진',
  })
  readonly image: string;

  @ApiProperty({
    description: '큐레이션 문구',
  })
  readonly description: string;

  constructor(data: any) {
    this._id = data._id;
    this.image = data?.cakes[0].image.s3Url;
    this.description = data?.description;
  }
}
