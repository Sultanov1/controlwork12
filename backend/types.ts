import {Model, Schema} from 'mongoose';

export interface PostDocument extends Document{
  user: Schema.Types.ObjectId;
  name: string;
  image: string;
  published: boolean;
}

export interface PostUser  {
  name: string;
  image: string;
  user: string;
}

export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  googleID?: string;
  avatar?: string | null;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;
