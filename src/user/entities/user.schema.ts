import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from './roles.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class User {
  @Prop({ type: String, unique: true, required: true })
  firebaseUid: string;

  @Prop({ type: String, required: true })
  nickname: string;

  @Prop({ type: String, required: true })
  oauth_provider: string;

  @Prop({
    type: [String],
    enum: [Roles.ADMIN, Roles.BUYER, Roles.SELLER],
    default: [Roles.BUYER],
  })
  roles: Roles[];

  @Prop({ type: [{ type: String, ref: 'Cake', default: [] }] })
  cake_like_ids: string[];

  @Prop({ type: [{ type: String, ref: 'Store', default: [] }] })
  store_like_ids: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
