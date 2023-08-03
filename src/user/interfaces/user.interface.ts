import { Document } from 'mongoose';
import { Roles } from '../entities/roles.enum';

export interface IUser {
  firebaseUid: string;
  nickname: string;
  oauth_provider: string;
  roles: Roles;
  cake_like_ids: string[];
  store_like_ids: string[];
}

export type UserDocument = IUser & Document;
export default IUser;
