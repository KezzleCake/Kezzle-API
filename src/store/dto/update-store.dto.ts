import { Image } from '../../common/entities/image.Schema';
import { Location } from '../entities/location.schema';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto {
  @IsOptional()
  @ApiProperty({
    type: Image,
    description: '케이크 매장 로고 사진',
    required: false,
  })
  logo?: Image;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '케이크 매장 간단소개',
    example:
      '본비케이크만의 무드를 담은 케이크로 소중한 날을 더욱 특별하게 만들어드려요 :)',
    required: false,
  })
  store_feature?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '상세보기 케이크 매장소개',
    example:
      '안녕하세요~ 저희매장은 소중한날 행복할 수 있도록 정성스럽게 제작해드리겠습니다:) 공지사항....',
    required: false,
  })
  store_description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '매장 인스타그램 링크',
    required: false,
  })
  insta_url?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '매장 카카오 채널 링크',
    required: false,
  })
  kakako_url?: string;

  @IsOptional()
  @ApiProperty({
    type: Location,
    description: '케이크 매장 위도 경도',
  })
  location?: Location;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '케이크 매장 주소',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '케이크 매장 전화번호',
    required: false,
  })
  phone_number?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '케이크 매장 오픈 시간 ',
    example: '[10:00 ~ 17:00, 09:00 ~ 16:00, ...]',
    required: false,
  })
  operating_time?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: String,
    description: '케이크 매장 오픈 시간 ',
    example: '[초코, 딸기, 당근]',
  })
  taste?: string[];
}
