import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Image } from '../../common/entities/image.Schema';

export class UpdateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: Image,
    description: '케이크에 관련된 이미지',
    example: {
      name: '1.png',
      s3Url:
        'https://example-bucket.s3.region.amazonaws.com/test/41f1904d-cb2e-45f3-b5ee-072bc49cba11.png',
    },
    required: false,
  })
  image?: Image;
}
