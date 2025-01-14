import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.model';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<IAuthDocument | null> {
    return await AuthModel.create(data);
  }

  public async getUserByEmail(email: string): Promise<IAuthDocument | null> {
    return await AuthModel.findOne({ email });
  }

  public async updatePasswordToken(
    authId: string,
    otp: string,
    otpExpiration: number
  ): Promise<void> {
    await AuthModel.updateOne(
      { _id: authId },
      {
        passwordResetToken: otp,
        passwordResetExpiresIn: otpExpiration
      }
    );
  }

  public async getAuthUserByPasswordToken(
    email: string,
    otp: string
  ): Promise<IAuthDocument | null> {
    return await AuthModel.findOne({
      email,
      passwordResetToken: otp
    });
  }
}

export const authService: AuthService = new AuthService();
