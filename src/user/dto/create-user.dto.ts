import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: '유저 닉네임',
  })
  readonly nickname: string;
}
