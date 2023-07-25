import { IsBoolean, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  oauth_provider: string;

  @IsBoolean()
  is_admin: boolean;

  @IsBoolean()
  is_buyer: boolean;

  @IsBoolean()
  is_seller: boolean;

  @IsArray()
  @IsString({ each: true })
  cake_like_ids: string[];

  @IsArray()
  @IsString({ each: true })
  store_like_ids: string[];
}
