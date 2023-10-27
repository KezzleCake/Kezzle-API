import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type KeywordLogDocument = KeywordLog & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class KeywordLog {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String })
  searchWord: string;

  @Prop({ type: [{ type: String }] })
  relatedWord: string[];
}

const schema = SchemaFactory.createForClass(KeywordLog);
export const KeywordLogSchema = schema;
