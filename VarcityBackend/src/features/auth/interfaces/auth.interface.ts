import { Document, ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

export interface AuthPayload {
  userId: string;
  email: string;
  iat?: number;
}

export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  email: string;
  authProvider: keyof typeof AuthProviders;
  providerId: string;
  providerData: object;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpiresIn?: string | number;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface ISignUpData {
  _id: ObjectId;
  gender: 'male' | 'female';
  firstname: string;
  lastname: string;
  university: string;
  course: string;
  mobileNumber: string;
  email: string;
  password: string;
  profilePictures: string[];
  relationshipStatus: 'single' | 'married' | 'relationship';
  lookingFor: 'friendship' | 'relationship' | 'others';
  description: string;
  hobbies: string[];
}

export enum AuthProviders {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple'
}
