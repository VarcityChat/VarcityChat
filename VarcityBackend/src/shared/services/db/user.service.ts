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

  public async getUsersByUni(uniId: string, skip: number, limit: number): Promise<IUserDocument[]> {
    return await UserModel.find({ university: uniId }).skip(skip).limit(limit);
  }

  public async getUserByAuthId(authId: string): Promise<IUserDocument | null> {
    return await UserModel.findOne({ authId }).populate('university');
  }

  public async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user) {
      await UserModel.deleteOne({ _id: user._id });
      await AuthModel.deleteOne({ _id: user.authId });
    }
  }

  public async updateNotificationSettings(
    userId: string,
    settings: Partial<IUserDocument['settings']>
  ): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: { settings } });
  }

  public async updateUser(
    userId: string,
    data: Partial<IUserDocument>
  ): Promise<IUserDocument | null> {
    await UserModel.updateOne({ _id: userId }, { $set: data });
    return await UserModel.findById(userId);
  }
}

export const userService: UserService = new UserService();
