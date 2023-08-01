import { Image } from '../../common/entities/image.Schema';
import { Location } from '../entities/location.schema';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  logo?: Image;

  @IsOptional()
  @IsString()
  store_feature?: string;

  @IsOptional()
  @IsString()
  store_description?: string;

  @IsOptional()
  @IsString()
  insta_url?: string;

  @IsOptional()
  @IsString()
  kakako_url?: string;

  @IsOptional()
  location?: Location;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsArray()
  operating_time?: string[];

  @IsOptional()
  @IsArray()
  taste?: string[];
}
