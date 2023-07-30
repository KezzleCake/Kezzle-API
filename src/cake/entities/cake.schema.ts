import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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

export const CakeSchema = SchemaFactory.createForClass(Cake);
