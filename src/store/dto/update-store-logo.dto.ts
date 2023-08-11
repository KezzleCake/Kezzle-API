import { ImageResponseDto } from 'src/upload/dto/Image-response.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateStoreLogoDto {
  @ValidateNested()
  @Type(() => ImageResponseDto)
  @IsNotEmpty()
  @ApiProperty({
    type: ImageResponseDto,
    description: '케이크 매장 로고 사진',
    required: false,
  })
  readonly logo: ImageResponseDto;

  constructor(data: any) {
    this.logo = data;
  }
}
