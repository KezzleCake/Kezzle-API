import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Image } from '../entities/image.Schema';

export class CreateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  image: Image;

  @IsArray()
  @IsMongoId({ each: true })
  user_like_ids: string[];

  @IsNotEmpty()
  @IsMongoId()
  owner_user_id: string;

  @IsDateString()
  created_at: Date;

  @IsDateString()
  updated_at: Date;
}
