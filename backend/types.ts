import {Model} from 'mongoose';

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
