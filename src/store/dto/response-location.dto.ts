import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class LocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @ApiProperty({
    type: Number,
    description: '위도',
    example: 37.123456,
    required: true,
  })
  readonly latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @ApiProperty({
    type: Number,
    description: '경도',
    example: 127.123456,
    required: true,
  })
  readonly longitude: number;
}
