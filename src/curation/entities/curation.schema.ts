import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CakeResponseDto } from 'src/cake/dto/response-cake.dto';
export type CurationDocument = Curation & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class Curation {
  @Prop({ type: CakeResponseDto, required: true })
  cakes: CakeResponseDto[];

  @Prop({ type: String })
  key: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Date })
  updatedAt?: Date;
}

const schema = SchemaFactory.createForClass(Curation);
export const CurationSchema = schema;
