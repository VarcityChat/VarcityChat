import { notificationService } from '@service/db/notification.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async userNotifications(req: Request, res: Response): Promise<void> {
    const notifications = await notificationService.getUserNotifications(req.currentUser!.userId);
    res.status(HTTP_STATUS.OK).json({ message: 'Notifications Fetched', notifications });
  }
}

export const getNotifications: Get = new Get();
