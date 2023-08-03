import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Location {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string;

  //TODO: location에는 하지말래
  @ApiProperty({
    description: '매장의 위도 경도',
    example: '[126, 37]',
  })
  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
