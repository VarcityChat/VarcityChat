import { Document, ObjectId } from 'mongoose';

export interface IUserDocument extends Document {
  _id: string | ObjectId;
  email?: string;
  authId?: string | ObjectId;
  password?: string;
  firstname: string;
  lastname: string;
  gender: keyof typeof Gender;
  images: string[];
  university: string;
  course: string;
  mobileNumber?: string;
  relationshipStatus: keyof typeof RelationshipStatus;
  lookingFor: keyof typeof LookingFor;
  about: string;
  hobbies: string[];
  expoPushToken?: string;
}

export interface IUserImage {
  url: string;
  public_id?: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum RelationshipStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DATING = 'dating'
}

export enum LookingFor {
  FRIENDSHIP = 'friendship',
  RELATIONSHIP = 'relationship',
  OTHERS = 'others'
}
