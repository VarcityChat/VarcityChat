import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async conversationList(req: Request, res: Response): Promise<void> {
    const userId = req.currentUser?.userId;
    res.status(HTTP_STATUS.OK).json({ userId });
  }
}

export const getChats: Get = new Get();
