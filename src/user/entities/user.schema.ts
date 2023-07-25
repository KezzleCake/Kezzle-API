import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // timestamps: createdAt과 updatedAt을 자동으로 생성
export class User {
  @Prop({ type: String, required: true })
  nickname: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  oauth_provider: string;

  @Prop({ type: Object, required: true, default: {} })
  roles: {
    isAdmin: boolean;
    isBuyer: boolean;
    isSeller: boolean;
  };

  @Prop({ type: [{ type: String, ref: 'Cake' }] })
  cake_like_ids: string[];

  @Prop({ type: [{ type: String, ref: 'Store' }] })
  store_like_ids: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
