import { userService } from '@service/db/user.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async students(req: Request, res: Response): Promise<void> {
    const filter = req.query.filter || 'all';
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
    const skip = (page - 1) * limit;

    const [users, usersCount] = await Promise.all([
      userService.getUsersByUniWithFilter(
        req.currentUser!.userId,
        req.params.uniId,
        skip,
        limit,
        filter as 'all' | 'male' | 'female'
      ),
      userService.countUsersInUniByFilter(
        req.currentUser!.userId,
        req.params.uniId,
        filter as 'all' | 'male' | 'female'
      )
    ]);
    res.status(HTTP_STATUS.OK).json({
      message: 'Users',
      users,
      total: usersCount,
      currentPage: page,
      totalPages: Math.ceil(usersCount / limit)
    });
  }
}

export const getStudents: Get = new Get();
