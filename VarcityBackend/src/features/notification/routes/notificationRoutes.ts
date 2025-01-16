import express, { Router } from 'express';
import { sendNotification } from '@notification/controllers/send-notification';
import { updateNotification } from '@notification/controllers/update-notification';

class NotificationRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/notification/:userId/send', sendNotification.toUser);
    this.router.post(
      '/notification/:userId/mark-all-as-read',
      updateNotification.markAllUserNotificationsAsRead
    );
    return this.router;
  }
}

export const notificationRoutes: NotificationRoutes = new NotificationRoutes();
