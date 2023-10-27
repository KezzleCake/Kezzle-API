import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type AnniversaryDocument = Anniversary & Document;

@Schema() // timestamps: createdAt과 updatedAt을 자동으로 생성
export class Anniversary {
  @Prop({ type: String })
  name: string;

  @Prop({ type: [{ type: String }] })
  keyword: string[];

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: String })
  ment: string;
}

const schema = SchemaFactory.createForClass(Anniversary);
export const AnniversarySchema = schema;
