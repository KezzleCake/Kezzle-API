import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    description: '업로드할 파일',
    type: 'string',
    format: 'binary',
    required: true,
  })
  readonly file: any;
}
