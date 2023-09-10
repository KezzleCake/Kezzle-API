import { Document } from 'mongoose';

export interface ICake {
  img: string;
  fav: number;
  content: string;
  hash: string;
}

export type UserDocument = ICake & Document;
export default ICake;
