import { IsString } from 'class-validator';

export class CreateCakeDto {
  // img;
  // fav;
  // content;
  // hash;

  @IsString()
  readonly img: string;

  @IsString()
  readonly fav: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly hash: string;
}
