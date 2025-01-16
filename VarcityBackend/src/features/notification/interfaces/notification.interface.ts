import { ObjectId } from 'mongodb';

export interface INotificationDocument {
  _id: string | ObjectId;
  message: string;
  title: string;
  to: string | ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
