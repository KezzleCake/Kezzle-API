import { Image } from '../../common/entities/image.Schema';

export class DetailStoreResponseDto {
  //TODO: 지정한 위치랑 거리 차이 & 현재 로그인한 유저 스토어 좋아요 여부 & 좋아요 갯수
  readonly _id: string;
  readonly name: string;
  readonly logo: Image;
  readonly address: string;
  readonly insta_url: string;
  readonly kakako_url: string;
  readonly store_feature: string;
  readonly store_description: string;
  readonly phone_number: string;
  readonly detail_images: Image[];
  readonly operating_time: string[];
  readonly taste: string[];

  constructor(data: any) {
    this._id = data?._id;
    this.name = data?.name;
    this.logo = data?.logo;
    this.store_feature = data?.store_feature;
    this.store_description = data?.store_description;
    this.insta_url = data?.insta_url;
    this.kakako_url = data?.kakako_url;
    this.address = data?.address;
    this.phone_number = data?.phone_number;
    this.detail_images = data?.detail_images;
    this.operating_time = data?.operating_time;
    this.taste = data?.taste;
  }
}
