import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async students(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
    const skip = page > 0 ? page * limit : 0;

    const users: IUserDocument[] = await userService.getUsersByUni(req.params.uniId, skip, limit);
    res.status(HTTP_STATUS.OK).json({ message: 'Users', users });
  }
}

export const getStudents: Get = new Get();
