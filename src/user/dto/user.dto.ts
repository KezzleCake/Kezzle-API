import { IsBoolean, IsString, IsArray, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  username: string;

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

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;
}
