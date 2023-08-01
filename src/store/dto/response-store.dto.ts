import { Image } from '../../common/entities/image.Schema';
import { Location } from '../entities/location.schema';

export class StoreResponseDto {
  readonly name: string;
  readonly logo: Image;
  readonly store_feature: string;
  readonly store_description: string;
  readonly insta_url: string;
  readonly kakako_url: string;
  readonly location: Location;
  readonly address: string;
  readonly phone_number: string;
  readonly owner_user_id: string;
  readonly detail_images: Image[];
  readonly operating_time: string[];
  readonly taste: string[];

  constructor(data: any) {
    this.name = data?.name;
    this.logo = data?.logo;
    this.store_feature = data?.store_feature;
    this.store_description = data?.store_description;
    this.insta_url = data?.insta_url;
    this.kakako_url = data?.kakako_url;
    this.location = data?.location;
    this.address = data?.address;
    this.phone_number = data?.phone_number;
    this.owner_user_id = data?.owner_user_id;
    this.detail_images = data?.detail_images;
    this.operating_time = data?.operating_time;
    this.taste = data?.taste;
  }
}
