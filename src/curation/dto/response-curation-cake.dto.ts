import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CurationCakeResponsDto {
  @ApiProperty({
    description: '큐레이션 문구',
  })
  readonly description: string;

  @ApiProperty({
    description: '큐레이션 해당 케이크들',
  })
  readonly cakes: CakeResponseDto;

  constructor(descriptin: string, data: any) {
    this.description = descriptin;
    this.cakes = data;
  }
}
