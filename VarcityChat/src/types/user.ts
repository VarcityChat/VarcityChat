export interface IUser {
  _id: string;
  email?: string;
  firstname: string;
  lastname: string;
  gender: keyof typeof Gender;
  images: string[];
  university: string;
  course: string;
  mobileNumber?: string;
  relationshipStatus: keyof typeof RelationshipStatus;
  about: string;
  hobbies: string[];
  settings: {
    notificationsEnabled: boolean;
    activeStatus: boolean;
  };
}

export interface IUserImage {
  url: string;
  public_id?: string;
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum RelationshipStatus {
  SINGLE = "single",
  MARRIED = "married",
  DATING = "dating",
}

export enum LookingFor {
  FRIENDSHIP = "friendship",
  RELATIONSHIP = "relationship",
  OTHERS = "others",
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}
