import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.model';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<IAuthDocument | null> {
    return await AuthModel.create(data);
  }

  public async getUserByEmail(email: string): Promise<IAuthDocument | null> {
    return await AuthModel.findOne({ email });
  }
}

export const authService: AuthService = new AuthService();
