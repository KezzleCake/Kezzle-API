import { ApiProperty } from '@nestjs/swagger';
import { CurationDto } from './response-curation.dto';

export class CurationsDto {
  @ApiProperty({
    description: '키워드 설명글 대분류',
  })
  readonly note: string;

  @ApiProperty({
    description: '큐레이션들',
  })
  readonly cakes: CurationDto[];

  constructor(data: any, note: string) {
    this.note = note;
    this.cakes = data;
  }
}
