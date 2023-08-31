import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Image {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  converte_name: string;

  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, required: true })
  s3Url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
