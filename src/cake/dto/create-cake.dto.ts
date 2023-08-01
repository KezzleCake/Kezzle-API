import { IsNotEmpty, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Image } from '../../common/entities/image.Schema';

export class CreateCakeDto {
  @ValidateNested()
  @Type(() => Image)
  @IsNotEmpty()
  image: Image;
}
