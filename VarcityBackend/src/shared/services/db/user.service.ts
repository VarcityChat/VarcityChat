import { AuthModel } from '@auth/models/auth.model';
import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { UserModel } from '@root/features/user/models/user.model';

class UserService {
  public async createUser(data: IUserDocument): Promise<IUserDocument | null> {
    return await UserModel.create(data);
  }

  public async getUserById(userId: string): Promise<IUserDocument | null> {
    return await UserModel.findById(userId).populate('authId', 'email');
  }

  public async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user) {
      await UserModel.deleteOne({ _id: user._id });
      await AuthModel.deleteOne({ _id: user.authId });
    }
  }
}

export const userService: UserService = new UserService();
