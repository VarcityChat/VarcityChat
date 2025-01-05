import { Request, Response } from 'express';
import { validator } from '@global/decorators/joi-validation-decorator';
import { loginSchema } from '@auth/schemes/signin';
import { IUserDocument } from '@user/interfaces/user.interface';
import { authService } from '@root/shared/services/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { userService } from '@root/shared/services/db/user.service';
import { Helpers } from '@global/helpers/helpers';
import HTTP_STATUS from 'http-status-codes';

class SignIn {
  @validator(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const authUser = await authService.getUserByEmail(email);
    if (!authUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await authUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const user: IUserDocument | null = await userService.getUserByAuthId(`${authUser._id}`);
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const signedToken: string = Helpers.signToken({
      userId: user._id,
      email: authUser.email
    });

    res.status(HTTP_STATUS.OK).json({ message: 'User login successful', token: signedToken, user });
  }
}

export const signin: SignIn = new SignIn();
