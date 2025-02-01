import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { validator } from '@global/decorators/joi-validation-decorator';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { IUserDocument, IUserImage } from '@root/features/user/interfaces/user.interface';
import { authService } from '@root/shared/services/db/auth.service';
import { Request, Response } from 'express';
import { signupSchema } from '@auth/schemes/signup';
import { UploadApiResponse } from 'cloudinary';
import { uploadMultiple } from '@global/helpers/cloudinary-upload';
import { userService } from '@root/shared/services/db/user.service';
import { uniService } from '@root/shared/services/db/uni.service';
import HTTP_STATUS from 'http-status-codes';

class SignUp {
  @validator(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const {
      email,
      password,
      course,
      university,
      gender,
      mobileNumber,
      firstname,
      lastname,
      relationshipStatus,
      lookingFor,
      images
    } = req.body;

    const userExists = await authService.getUserByEmail(Helpers.lowerCase(email));
    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    const uni = await uniService.getUniByID(university);
    if (!uni) {
      throw new BadRequestError('We do not support this university at the time.');
    }

    // Images Upload
    const uploadedImages: IUserImage[] = [];
    if (images) {
      const imageResponses: UploadApiResponse[] = (await uploadMultiple(
        images,
        'image',
        true,
        true
      )) as UploadApiResponse[];
      imageResponses.forEach((response) => {
        if (!response.public_id) {
          throw new BadRequestError('An error occurred while uploading images');
        }
        uploadedImages.push({ url: response.secure_url, public_id: response.public_id });
      });
    }

    const authData: IAuthDocument = {
      email,
      password
    } as unknown as IAuthDocument;
    const authUser: IAuthDocument = (await authService.createAuthUser(authData)) as IAuthDocument;

    const userData: IUserDocument = {
      email: Helpers.lowerCase(email),
      authId: authUser._id,
      firstname,
      lastname,
      university: uni._id,
      mobileNumber,
      course,
      gender,
      images: uploadedImages,
      relationshipStatus,
      lookingFor,
      expoPushToken: ''
    } as unknown as IUserDocument;
    const user: IUserDocument = (await userService.createUser(userData)) as IUserDocument;

    const jwtPayload = {
      email,
      userId: user._id
    };

    const authToken: string = Helpers.signToken(jwtPayload);
    res.status(HTTP_STATUS.OK).json({ message: 'Account created', token: authToken, user });
  }
}

export const signup: SignUp = new SignUp();
