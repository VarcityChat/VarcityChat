export interface IUser {
  id: string | number;
  fullName: string;
  hobbies: string[];
  isNew: boolean;
  lookingFor: string;
  images?: string[];
}
