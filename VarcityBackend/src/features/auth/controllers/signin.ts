import { Request, Response } from 'express';
import { validator } from '@global/decorators/joi-validation-decorator';
import { loginSchema } from '@auth/schemes/signin';
import HTTP_STATUS from 'http-status-codes';

class SignIn {
  @validator(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    res.status(HTTP_STATUS.OK).json({ message: 'User login successful', email, password });
  }
}

export const signin: SignIn = new SignIn();
