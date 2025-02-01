import { IUser } from "@/types/user";

export interface ILoginResponse {
  token: string;
  user: IUser;
}

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
