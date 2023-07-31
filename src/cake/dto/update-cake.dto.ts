import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Image } from '../../common/entities/image.Schema';

export class UpdateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  @IsOptional()
  image?: Image;

  @IsNotEmpty()
  @IsMongoId()
  owner_store_id: string;
}
