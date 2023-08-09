import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Image, ImageSchema } from '../../upload/entities/image.Schema';
import { LocationSchema, Location } from './location.schema';

export type StoreDocument = Store & Document;
@Schema({ timestamps: true, versionKey: false })
export class Store {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: ImageSchema })
  logo: Image;

  @Prop({ type: String, default: '' })
  store_feature: string;

  @Prop({ type: String, default: '' })
  store_description: string;

  @Prop({ type: String, default: '' })
  insta_url: string;

  @Prop({ type: String, default: '' })
  kakako_url: string;

  @Prop({ type: String, default: '' })
  kakao_map_url: string;

  @Prop({
    type: LocationSchema,
  })
  location: Location;

  @Prop({ required: true, default: '' })
  address: string;

  @Prop({ default: '' })
  phone_number: string;

  @Prop({ type: String, ref: 'User', required: true })
  owner_user_id: string;

  @Prop({ type: [ImageSchema] })
  detail_images: Image[];

  @Prop({ type: [{ type: String }] })
  operating_time: string[];

  @Prop({ type: [{ type: String, ref: 'User', default: [] }] })
  user_like_ids: string[];

  @Prop({ required: true, type: [{ type: String }] })
  taste: string[];
}

const StoreSchema = SchemaFactory.createForClass(Store);
StoreSchema.index({ location: '2dsphere' });
export { StoreSchema };
