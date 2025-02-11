import { IUser } from "@/types/user";

export interface INotification {
  _id: string;
  message: string;
  title: string;
  to: string;
  from?: string | IUser;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
