import { IsBoolean, IsString, IsArray } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  nickname: string;
}
