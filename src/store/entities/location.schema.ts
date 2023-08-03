import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Location {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
