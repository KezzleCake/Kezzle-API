import { ApiProperty } from '@nestjs/swagger';

export class PaginateResponseDto<T> {
  @ApiProperty({
    description: '페이징된 결과 데이터를 담고 있는 배열',
    isArray: true,
  })
  readonly docs: T[];

  @ApiProperty({ description: '전체 결과 데이터의 개수' })
  readonly totalDocs: number;

  @ApiProperty({ description: '한 페이지에 보여줄 결과 데이터의 개수' })
  readonly limit: number;

  @ApiProperty({ description: '이전 페이지가 있는지 여부' })
  readonly hasPrevPage: boolean;

  @ApiProperty({ description: '다음 페이지가 있는지 여부' })
  readonly hasNextPage: boolean;

  @ApiProperty({ description: '현재 페이지 번호' })
  readonly page?: number;

  @ApiProperty({ description: '전체 페이지 수' })
  readonly totalPages: number;

  @ApiProperty({ description: '현재 페이지의 시작 인덱스' })
  readonly offset: number;

  @ApiProperty({ description: '이전 페이지 번호' })
  readonly prevPage?: number | null;

  @ApiProperty({ description: '다음 페이지 번호' })
  readonly nextPage?: number | null;

  @ApiProperty({
    description:
      '페이징된 결과 데이터 중 현재 페이지 이전에 나온 데이터의 개수',
  })
  readonly pagingCounter: number;

  @ApiProperty({ type: Object, required: false, description: '기타 메타 정보' })
  readonly meta?: any;
}
