import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  oauth_provider: string;
}
