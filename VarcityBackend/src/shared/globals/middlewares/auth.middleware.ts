import { AuthPayload } from '@auth/interfaces/auth.interface';
import { BadRequestError, NotAuthorizedError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';

class AuthMiddleware {
  public protect(req: Request, res: Response, next: NextFunction): void {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) throw new BadRequestError('Token is not available. Please login.');

    try {
      const payload: AuthPayload = JWT.verify(token, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new NotAuthorizedError('Tokeni is invalid. Please login');
    }

    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
