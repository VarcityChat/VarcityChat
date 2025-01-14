/* eslint-disable quotes */
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { validator } from '@global/decorators/joi-validation-decorator';
import { authService } from '@service/db/auth.service';
import { Request, Response } from 'express';
import { emailTransport } from '@service/emails/email.transport';
import HTTP_STATUS from 'http-status-codes';

export const OTP_EXPIRES_IN = 5 * 60 * 1000;

class Password {
  @validator(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const existingUser: IAuthDocument | null = await authService.getUserByEmail(email);
    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const otp = `${Helpers.generateOtp(4)}`;
    // const otp = '1111';
    await authService.updatePasswordToken(`${existingUser._id}`, otp, Date.now() + OTP_EXPIRES_IN);

    const msg = await emailTransport.sendMail(
      email,
      'Varcity Password Reset Token',
      otp,
      'reset-password'
    );
    if (msg === 'error') throw new BadRequestError("Sorry, we couldn't send the email, try again");
    res.status(HTTP_STATUS.OK).json({ message: 'Password reset otp sent.' });
  }

  @validator(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, otp, email } = req.body;

    const existingUser: IAuthDocument | null = await authService.getAuthUserByPasswordToken(
      email,
      otp
    );

    if (!existingUser) throw new BadRequestError('Invalid token.');

    if (new Date(existingUser.passwordResetExpiresIn as number).getTime() <= Date.now())
      throw new BadRequestError('Reset token has expired.');

    existingUser.password = password;
    existingUser.passwordResetExpiresIn = undefined;
    existingUser.passwordResetToken = '';

    await existingUser.save();
    res.status(HTTP_STATUS.OK).json({ message: 'Password reset successfully.' });
  }
}

export const password: Password = new Password();
