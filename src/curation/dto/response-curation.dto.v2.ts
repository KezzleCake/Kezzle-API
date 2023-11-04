import { ApiProperty } from '@nestjs/swagger';
import { CakeSimpleResponseDto } from 'src/cake/dto/response-cake-simple.dto';

export class CurationDtoV2 {
  @ApiProperty({
    description: '큐레이션 id',
    example: '60f9b0b3e6b3f3b3b4b3b3b3',
  })
  readonly _id: string;

  @ApiProperty({
    description: '큐레이션에 관련한 사진들 url',
    type: [CakeSimpleResponseDto],
  })
  readonly cakes: CakeSimpleResponseDto[];

  @ApiProperty({
    description: '큐레이션 문구',
    example: '케이크를 좋아하는 사람들을 위한 케이크 모음',
  })
  readonly description: string;

  constructor(data: any) {
    this._id = data._id;
    this.cakes = data?.cakes
      .map((cake) => new CakeSimpleResponseDto(cake))
      .slice(0, 6);
    this.description = data?.key;
  }
}
