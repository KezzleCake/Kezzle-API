import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ImageRequestDto } from '../../upload/dto/Image-request.dto';

export type CakeDocument = Cake & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class Cake {
  @Prop({ type: ImageRequestDto, required: true })
  image: ImageRequestDto;

  @Prop({ type: [{ type: String, ref: 'User', default: [] }] })
  user_like_ids: string[];

  @Prop({ type: String, ref: 'User' })
  owner_store_id: string;
}

const schema = SchemaFactory.createForClass(Cake);
schema.plugin(mongoosePaginate.default);
export const CakeSchema = schema;
