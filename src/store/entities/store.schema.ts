import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Image, ImageSchema } from '../../common/entities/image.Schema';

export type StoreDocument = Store & Document;
@Schema({ timestamps: true, versionKey: false })
export class Store {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: ImageSchema })
  logo: Image;

  @Prop({ type: String, default: [] })
  store_feature: string;

  @Prop({ type: String, default: [] })
  store_description: string;

  @Prop({ type: String, default: [] })
  insta_url: string;

  @Prop({ type: String, default: [] })
  kakako_url: string;

  //   @Prop 위도 경도 우째 잡아...
  //   location;

  @Prop({ default: [] })
  address: string;

  @Prop({ default: [] })
  phone_number: string;

  // @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true }) <- 이런식으로 하면 됨
  // owner_user_id: User;

  @Prop({ type: ImageSchema })
  detail_images: Image[];

  @Prop({ required: true, type: [{ type: String }] })
  operating_time: string[];

  @Prop({ type: [{ type: String, ref: 'User', default: [] }] })
  user_like_ids: string[];

  @Prop({ required: true, type: [{ type: String }] })
  taste: string[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
