import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ImageResponseDto } from 'src/upload/dto/Image-response.dto';

export type CakeDocument = NCake & Document;

//TODO: 수정해야함
@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class NCake {
  @Prop({ type: ImageResponseDto }) //, required: true })
  image: ImageResponseDto;

  @Prop({ type: String })
  cursor: string;

  @Prop({ type: [{ type: String, ref: 'User', default: [] }] })
  user_like_ids: string[];

  @Prop({ type: String, ref: 'User' })
  owner_store_id: string;

  @Prop({ type: String })
  like_ins: string;

  @Prop({ type: [{ type: String }] })
  tag_ins: string[];

  @Prop({ type: String })
  content_ins: string;
}

const schema = SchemaFactory.createForClass(NCake);
export const CakeSchema = schema;
