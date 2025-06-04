import { validator } from '@global/decorators/joi-validation-decorator';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { updateUserSchema } from '@user/schemes/user.scheme';
import Expo from 'expo-server-sdk';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Update {
  @validator(updateUserSchema)
  public async user(req: Request, res: Response): Promise<void> {
    const {
      firstname,
      lastname,
      images,
      about,
      relationshipStatus,
      lookingFor,
      mobileNumber,
      course
    } = req.body;

    const user: IUserDocument | null = await userService.getUserById(req.currentUser!.userId);
    if (!user) throw new NotFoundError('User not found');

    if (user._id.toString() !== req.currentUser!.userId.toString()) {
      throw new BadRequestError('You are not authorized to update this user');
    }

    const dataToUpdate = {
      firstname: user.firstname,
      lastname: user.lastname,
      images: user.images,
      about: user.about,
      relationshipStatus: user.relationshipStatus,
      lookingFor: user.lookingFor,
      mobileNumber: user.mobileNumber,
      course: user.course
    };
    if (firstname) dataToUpdate.firstname = firstname;
    if (lastname) dataToUpdate.lastname = lastname;
    if (images) dataToUpdate.images = images;
    if (about) dataToUpdate.about = about;
    if (relationshipStatus) dataToUpdate.relationshipStatus = relationshipStatus;
    if (lookingFor) dataToUpdate.lookingFor = lookingFor;
    if (mobileNumber) dataToUpdate.mobileNumber = mobileNumber;
    if (course) dataToUpdate.course = course;

    const updatedUser = await userService.updateUser(req.currentUser!.userId, dataToUpdate);

    res.status(HTTP_STATUS.OK).json({ message: 'User updated successfully', updatedUser });
  }

  public async updateStatus(req: Request, res: Response): Promise<void> {
    const user = await userService.getUserById(req.currentUser!.userId);
    if (!user) throw new NotFoundError('User not found');

    const body = req.body;
    user.settings.activeStatus = body.activeStatus;
    user.settings.notificationsEnabled = body.notificationsEnabled;
    await userService.updateNotificationSettings(req.currentUser!.userId, body);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'User status updated successfully', updatedUser: user });
  }

  /**
   * @param
   * @desc defines the endpoint to store expo push token
   */
  // @validator(savePushTokenSchema)
  public async savePushNotificationToken(req: Request, res: Response): Promise<void> {
    const { deviceToken } = req.body;
    console.log('\nDEVICE TOKEN:', deviceToken);
    if (Expo.isExpoPushToken(deviceToken)) {
      await userService.updateUser(req.currentUser!.userId, { deviceToken });
      res.status(HTTP_STATUS.OK).json({ message: 'PushToken saved successfully' });
    } else {
      throw new BadRequestError('Invalid Push Token');
    }
  }
}

export const updateUser: Update = new Update();
