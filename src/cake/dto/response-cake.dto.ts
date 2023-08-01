import { Image } from '../../common/entities/image.Schema';

export class CakeResponseDto {
  readonly _id: string;
  readonly image: Image;
  readonly owner_store_id: string;
  readonly isLiked: boolean;

  constructor(data: any, userid: string) {
    this._id = data?._id;
    this.image = data?.image;
    this.owner_store_id = data?.owner_store_id;
    this.isLiked = data?.user_like_ids.includes(userid);
  }
}
