import { IsBoolean, IsString, IsArray } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  nickname: string;

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
