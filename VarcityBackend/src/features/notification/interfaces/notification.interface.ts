import { IUserDocument } from '@user/interfaces/user.interface';
import { ObjectId } from 'mongodb';

export interface INotificationDocument {
  _id: string | ObjectId;
  message: string;
  title: string;
  to: string | ObjectId;
  from?: string | ObjectId | IUserDocument;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
