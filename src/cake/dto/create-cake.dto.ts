import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Image } from '../../common/entities/image.Schema';

export class CreateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  image: Image;

  @IsNotEmpty()
  @IsMongoId()
  owner_store_id: string;
}
