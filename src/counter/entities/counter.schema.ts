import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema({ versionKey: false })
export class Counter {
  @Prop({ type: String, required: true, index: true })
  sequenceName: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

const schema = SchemaFactory.createForClass(Counter);
export const CounterSchema = schema;
