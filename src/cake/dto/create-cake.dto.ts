import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Image } from '../../common/entities/image.Schema';

export class CreateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  @ApiProperty({
    type: Image,
    description: '케이크에 관련된 이미지',
    example: {
      name: '1.png',
      s3Url:
        'https://example-bucket.s3.region.amazonaws.com/test/41f1904d-cb2e-45f3-b5ee-072bc49cba11.png',
    },
    required: true,
  })
  readonly image: Image;
}
