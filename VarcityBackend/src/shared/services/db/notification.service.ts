import { NotificationModel } from '@notification/models/notification.model';
import { ExpoPushMessage, Expo } from 'expo-server-sdk';

type NotificationMessage = Pick<ExpoPushMessage, 'body' | 'title'>;

class NotificationService {
  public expo: Expo | undefined;

  //   constructor() {
  //     this.expo = new Expo();
  //   }

  //   public async sendNotification(
  //     pushTokens: string[],
  //     notificationMessage: NotificationMessage
  //   ): Promise<void> {
  //     const messages: ExpoPushMessage[] = [];

  //     for (const pushToken of pushTokens) {
  //       console.log('\nSENDING PUSH NOTIFICATIOn');
  //       if (!Expo.isExpoPushToken(pushToken)) {
  //         console.log('\nINVALID PUSH TOKEN:', pushToken);
  //         continue;
  //       }

  //       messages.push({
  //         to: pushToken,
  //         sound: 'default',
  //         body: notificationMessage.body,
  //         title: notificationMessage.title
  //       });
  //     }

  //     const chunks = this.expo!.chunkPushNotifications(messages);
  //     const tickets: ExpoPushTicket[] = [];
  //     for (const chunk of chunks) {
  //       try {
  //         const ticketChunk: ExpoPushTicket[] = await this.expo!.sendPushNotificationsAsync(chunk);
  //         console.log('\nPUSH NOTIFICATION TICKET:', ticketChunk);
  //         tickets.push(...ticketChunk);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }

  //   public async sendSingleNotification(
  //     pushToken: string,
  //     notificationMessage: NotificationMessage
  //   ): Promise<void> {
  //     await this.sendNotification([pushToken], notificationMessage);
  //   }

  public async markAllUserNotificationsAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ to: userId }).set({ read: true });
  }

  public async saveNotificationToDb(
    userId: string,
    notificationMessage: NotificationMessage,
    from?: string
  ): Promise<void> {
    await NotificationModel.create({
      to: userId,
      title: notificationMessage.title,
      message: notificationMessage.body,
      from: from ? from : null
    });
  }

  public async sendNotificationToUser(
    userId: string,
    notificationMessage: NotificationMessage
  ): Promise<void> {
    console.log('Sending notification to user:', userId, notificationMessage);
  }

  //   public async sendNotificationToUser(
  //     userId: string,
  //     notificationMessage: Pick<ExpoPushMessage, 'title' | 'body'>
  //   ): Promise<void> {
  //     const user: IUserDocument = await userService.getUserById(userId);
  //     if (!user) return;

  //     const pushToken = user?.expoPushToken;
  //     if (pushToken) await this.sendNotification([pushToken], notificationMessage);
  //   }
}

export const notificationService: NotificationService = new NotificationService();
