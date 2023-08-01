import { Image } from '../../common/entities/image.Schema';

export class StoreResponseDto {
  //TODO: 지정한 위치랑 거리 차이 & 매장 사진 넘겨줘야함
  readonly _id: string;
  readonly name: string;
  readonly logo: Image;
  readonly address: string;
  readonly isLiked: boolean;

  constructor(data: any, userid: string) {
    this._id = data?._id;
    this.name = data?.name;
    this.logo = data?.logo;
    this.address = data?.address;
    this.isLiked = data?.user_like_ids.includes(userid);
  }
}
