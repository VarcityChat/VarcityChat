import { Request, Response } from 'express';
import { notificationService } from '@service/db/notification.service';
import HTTP_STATUS from 'http-status-codes';

class Update {
  public async markAllUserNotificationsAsRead(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    await notificationService.markAllUserNotificationsAsRead(userId);
    res.status(HTTP_STATUS.OK).json({ message: 'All notifications marked as read' });
  }
}

export const updateNotification: Update = new Update();
