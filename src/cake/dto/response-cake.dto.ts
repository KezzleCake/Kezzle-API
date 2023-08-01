import { Image } from '../../common/entities/image.Schema';

export class CakeResponseDto {
  readonly image: Image;
  readonly owner_store_id: string;

  constructor(data: any) {
    this.image = data?.image;
    this.owner_store_id = data?.owner_store_id;
  }
}
