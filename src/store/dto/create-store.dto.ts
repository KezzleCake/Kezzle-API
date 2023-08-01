import { Image } from '../../common/entities/image.Schema';
import { Location } from '../entities/location.schema';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  logo: Image;

  @IsOptional()
  @IsString()
  store_feature: string;

  @IsOptional()
  @IsString()
  store_description: string;

  @IsOptional()
  @IsString()
  insta_url: string;

  @IsOptional()
  @IsString()
  kakako_url: string;

  @IsNotEmpty()
  location: Location;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  owner_user_id: string;

  @IsOptional()
  logo_images: Image[];

  @IsArray()
  operating_time: string[];

  @IsArray()
  taste: string[];
}
