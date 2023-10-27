import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
export type CakeLikeLogDocument = CakeLikeLog & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class CakeLikeLog {
  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true })
  cakeId: string;

  @Prop({ type: Boolean })
  type: boolean;
}

const schema = SchemaFactory.createForClass(CakeLikeLog);
export const CakeLikeLogSchema = schema;
