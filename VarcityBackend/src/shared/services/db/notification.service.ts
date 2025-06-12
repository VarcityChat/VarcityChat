import { INotificationDocument } from '@notification/interfaces/notification.interface';
import { NotificationModel } from '@notification/models/notification.model';
import { IUserDocument } from '@user/interfaces/user.interface';
import { ExpoPushMessage, Expo, ExpoPushTicket } from 'expo-server-sdk';
import { userService } from './user.service';
import { IMessageData } from '@chat/interfaces/chat.interface';

type NotificationMessage = Pick<ExpoPushMessage, 'body' | 'title'>;

class NotificationService {
  public expo: Expo | undefined;

  constructor() {
    this.expo = new Expo();
  }

  public async sendNotification(
    pushTokens: string[],
    notificationMessage: NotificationMessage
  ): Promise<void> {
    const messages: ExpoPushMessage[] = [];

    for (const pushToken of pushTokens) {
      console.log('\nSENDING PUSH NOTIFICATIOn');
      if (!Expo.isExpoPushToken(pushToken)) {
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        body: notificationMessage.body,
        title: notificationMessage.title,
        badge: 1
      });
    }

    const chunks = this.expo!.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk: ExpoPushTicket[] = await this.expo!.sendPushNotificationsAsync(chunk);
        console.log('\nPUSH NOTIFICATION TICKET:', ticketChunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        console.error(err);
      }
    }
  }

  public async sendSingleNotification(
    pushToken: string,
    notificationMessage: NotificationMessage
  ): Promise<void> {
    await this.sendNotification([pushToken], notificationMessage);
  }

  public async getUserNotifications(userId: string): Promise<INotificationDocument[]> {
    return await NotificationModel.find({ to: userId })
      .limit(200)
      .sort({ createdAt: -1 })
      .populate('from');
  }

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

  // public async sendNotificationToUser(
  //   userId: string,
  //   notificationMessage: NotificationMessage
  // ): Promise<void> {
  //   console.log('Sending notification to user:', userId, notificationMessage);
  // }

  public async sendNotificationToUser(
    userId: string,
    notificationMessage: Pick<ExpoPushMessage, 'title' | 'body'>
  ): Promise<void> {
    const user: IUserDocument | null = await userService.getUserById(userId);
    if (!user) return;

    const pushToken = user?.deviceToken;
    if (pushToken) await this.sendNotification([pushToken], notificationMessage);
  }

  public async sendChatMessageNotification(message: IMessageData): Promise<void> {
    try {
      const receiver: IUserDocument | null = await userService.getUserById(`${message.receiver}`);
      if (!receiver) return;
      if (!receiver.settings.notificationsEnabled) return;

      let senderName = message?.senderName;
      if (!senderName) {
        const user: IUserDocument | null = await userService.getUserById(`${message.sender}`);
        senderName = user?.firstname;
      }

      const pushToken = receiver?.deviceToken;
      if (pushToken)
        await this.sendNotification([pushToken], {
          title: senderName || 'New Message',
          body: message.content
            ? message.content
            : message?.audio
              ? '🎙️ voice message'
              : message?.mediaUrls
                ? `🗾 ${message.mediaUrls.length} image${message.mediaUrls.length > 1 ? 's' : ''}`
                : 'New Message'
        });
    } catch (err) {
      console.error('An error occurred while sending chat push notifications:', err);
    }
  }
}

export const notificationService: NotificationService = new NotificationService();
