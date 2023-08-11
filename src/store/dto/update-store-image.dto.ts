import { ImageResponseDto } from 'src/upload/dto/Image-response.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Image } from '../../upload/entities/image.Schema';

export class UpdateStoreImageDto {
  @ValidateNested()
  @Type(() => ImageResponseDto)
  @IsNotEmpty()
  @ApiProperty({
    type: ImageResponseDto,
    description: '케이크 매장 소개 이미지들',
    required: false,
  })
  readonly detail_images: ImageResponseDto[];

  constructor(data: ImageResponseDto, oldData: Image[]) {
    this.detail_images = oldData.concat(data);
  }
}
