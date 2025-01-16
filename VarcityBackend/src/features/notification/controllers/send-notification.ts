import { Request, Response } from 'express';
import { notificationService } from '@service/db/notification.service';
import { validator } from '@global/decorators/joi-validation-decorator';
import { notificationMessageSchema } from '@notification/schemes/notification.scheme';
import HTTP_STATUS from 'http-status-codes';

class Send {
  @validator(notificationMessageSchema)
  public async toUser(req: Request, res: Response): Promise<void> {
    const { message, title } = req.body;
    const { userId } = req.params;
    await notificationService.saveNotificationToDb(userId, { title, body: message });
    await notificationService.sendNotificationToUser(userId, {
      title,
      body: message
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Push notification sent successfully' });
  }
}

export const sendNotification: Send = new Send();
