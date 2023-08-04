import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNumber, IsOptional } from 'class-validator';

export class PageableQuery {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '현재 페이지 번호', example: 1, default: 1 })
  readonly page: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: '한 페이지에 보여줄 결과 데이터의 개수',
    example: 10,
    default: 10,
  })
  readonly size: number = 10;

  @IsOptional()
  @IsAlpha()
  @ApiProperty({
    description: '정렬 기준',
    example: ['createdAt', 'desc'],
    default: [],
  })
  readonly sort: string[] = [];
}
