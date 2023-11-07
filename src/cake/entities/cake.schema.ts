import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ImageResponseDto } from 'src/upload/dto/Image-response.dto';

export type CakeDocument = Cake & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class Cake {
  @Prop({ type: ImageResponseDto, required: true })
  image: ImageResponseDto;

  @Prop({ type: String })
  cursor: string;

  @Prop({ type: [{ type: String, ref: 'User', default: [] }] })
  user_like_ids: string[];

  @Prop({ type: String, ref: 'User', index: true })
  owner_store_id: string;

  @Prop({ type: String })
  like_ins: string;

  @Prop({ type: [{ type: String }] })
  tag_ins: string[];

  @Prop({ type: String })
  content_ins: string;

  @Prop({ type: Number })
  cal_likes: number;

  @Prop({ type: Number, unique: true, index: true })
  faiss_id: number;

  @Prop({ type: Boolean, index: true, default: false })
  is_delete: boolean;
}

const schema = SchemaFactory.createForClass(Cake);
export const CakeSchema = schema;
