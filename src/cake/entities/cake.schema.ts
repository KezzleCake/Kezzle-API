import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Image, ImageSchema } from '../../common/entities/image.Schema';

export type CakeDocument = Cake & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class Cake {
  @Prop({ type: ImageSchema, required: true })
  image: Image;

  @Prop({ type: [{ type: String, ref: 'User', default: [] }] })
  user_like_ids: string[];

  @Prop({ type: String, ref: 'User' })
  owner_store_id: string;
}

const schema = SchemaFactory.createForClass(Cake);
//TODO: 왜 mongoosePaginate뒤에 default를 붙여야하는 걸까
schema.plugin(mongoosePaginate.default);
export const CakeSchema = schema;
