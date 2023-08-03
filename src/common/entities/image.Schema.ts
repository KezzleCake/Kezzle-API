import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Image {
  @ApiProperty({
    description: '파일 업로드할 때 파일명',
    example: '1.png',
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    description: 'S3에 저장된 파일 URL',
    example:
      'https://example-bucket.s3.region.amazonaws.com/test/41f1904d-cb2e-45f3-b5ee-072bc49cba11.png',
  })
  @Prop({ type: String, required: true })
  s3Url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
