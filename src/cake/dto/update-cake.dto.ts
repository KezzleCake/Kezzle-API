import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Image } from '../entities/image.Schema';

export class UpdateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  @IsOptional()
  image?: Image;

  @IsOptional() // 업데이트 시 선택적으로 지정 가능
  @IsArray()
  @IsMongoId({ each: true })
  user_like_ids?: string[]; // 선택적으로 업데이트 가능한 user_like_ids

  @IsNotEmpty()
  @IsMongoId()
  owner_user_id: string;
}
