import { IUniversity } from "@/api/universities/types";

export interface IUser {
  _id: string;
  email?: string;
  firstname: string;
  lastname: string;
  gender: Gender.MALE | Gender.FEMALE;
  images: string[];
  university: string | IUniversity;
  course: string;
  mobileNumber?: string;
  relationshipStatus:
    | RelationshipStatus.SINGLE
    | RelationshipStatus.DATING
    | RelationshipStatus.MARRIED;
  lookingFor:
    | LookingFor.FRIENDSHIP
    | LookingFor.RELATIONSHIP
    | LookingFor.OTHERS;
  about: string;
  hobbies: string[];
  settings: {
    notificationsEnabled: boolean;
    activeStatus: boolean;
  };
  createdAt: string;
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

export const IsFirstLaunchKey = "isFirstLaunch";
