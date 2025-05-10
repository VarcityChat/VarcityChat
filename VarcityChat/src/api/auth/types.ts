import { IUser } from "@/types/user";

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface ISignupResponse extends ILoginResponse {}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IForgotPasswordBody {
  email: string;
}

export interface IResetPasswordBody {
  otp: string;
  email: string;
  password: string;
}

export interface ISignupBody {
  email?: string;
  gender?: string;
  password?: string;
  university?: string;
  firstname?: string;
  lastname?: string;
  relationshipStatus?: string;
  lookingFor?: string;
  images?: string[];
  about?: string;
}

export interface IGetSignedUrlResponse {
  cloudName: string;
  apiKey: string;
  timestamp: string;
  signature: string;
  folder: string;
}

export interface IUserExistsResponse {
  exists: boolean;
}
