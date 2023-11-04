import { ApiProperty } from '@nestjs/swagger';

export class AnniversaryDto {
  @ApiProperty({
    description: '기념일 id',
    example: '60c7c0e0f2b5f1a1e0b9b4e1',
  })
  readonly _id: string;

  @ApiProperty({
    description: '기념일 이름',
    example: '뺴빼로데이',
  })
  readonly name: string;

  @ApiProperty({
    description: '기념일 남은 날짜',
    example: 'D-7',
  })
  readonly dday: string;

  @ApiProperty({
    description: '기념일 멘트',
    example: '사랑을 전하는 \n빼빼로데이 케이크',
  })
  readonly ment: string;

  @ApiProperty({
    description: '기념일 이미지들',
    example: [
      'https://cdn.class101.net/images/3a6f3f27-2f3c-4a8f-8e1a-3a4b6f7d4d3e',
      'https://cdn.class101.net/images/3a6f3f27-2f3c-4a8f-8e1a-3a4b6f7d4d3e',
    ],
  })
  readonly images: string[];

  constructor(anniversary, images, day) {
    this._id = anniversary.id;
    this.name = anniversary.name;
    this.ment = anniversary.ment;
    this.dday = `D-${day}`;
    this.images = images;
  }
}
