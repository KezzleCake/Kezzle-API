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

  @Prop({ type: String, ref: 'User' })
  owner_store_id: string;
}

const schema = SchemaFactory.createForClass(Cake);
// schema.plugin(mongoosePaginate.default);
export const CakeSchema = schema;
