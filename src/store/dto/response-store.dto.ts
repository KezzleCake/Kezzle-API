import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
import { Image } from '../../common/entities/image.Schema';

export class StoreResponseDto {
  readonly _id: string;
  readonly name: string;
  readonly logo: Image;
  readonly address: string;
  readonly isLiked: boolean;
  readonly distance: string;
  readonly cakes: CakeResponseDto[];

  constructor(
    data: any,
    userid: string,
    dis: number,
    cakes: CakeResponseDto[],
  ) {
    this._id = data?._id;
    this.name = data?.name;
    this.logo = data?.logo;
    this.address = data?.address;
    this.isLiked = data?.user_like_ids.includes(userid);
    this.distance = dis.toFixed(1);
    this.cakes = cakes;
  }
}
