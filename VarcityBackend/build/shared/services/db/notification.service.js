"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const notification_model_1 = require("../../../features/notification/models/notification.model");
const expo_server_sdk_1 = require("expo-server-sdk");
const user_service_1 = require("./user.service");
class NotificationService {
    constructor() {
        this.expo = new expo_server_sdk_1.Expo();
    }
    async sendNotification(pushTokens, notificationMessage) {
        const messages = [];
        for (const pushToken of pushTokens) {
            console.log('\nSENDING PUSH NOTIFICATIOn');
            if (!expo_server_sdk_1.Expo.isExpoPushToken(pushToken)) {
                continue;
            }
            messages.push({
                to: pushToken,
                sound: 'default',
                body: notificationMessage.body,
                title: notificationMessage.title
            });
        }
        const chunks = this.expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of chunks) {
            try {
                const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                console.log('\nPUSH NOTIFICATION TICKET:', ticketChunk);
                tickets.push(...ticketChunk);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    async sendSingleNotification(pushToken, notificationMessage) {
        await this.sendNotification([pushToken], notificationMessage);
    }
    async getUserNotifications(userId) {
        return await notification_model_1.NotificationModel.find({ to: userId })
            .limit(200)
            .sort({ createdAt: -1 })
            .populate('from');
    }
    async markAllUserNotificationsAsRead(userId) {
        await notification_model_1.NotificationModel.updateMany({ to: userId }).set({ read: true });
    }
    async saveNotificationToDb(userId, notificationMessage, from) {
        await notification_model_1.NotificationModel.create({
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
    async sendNotificationToUser(userId, notificationMessage) {
        const user = await user_service_1.userService.getUserById(userId);
        if (!user)
            return;
        const pushToken = user?.deviceToken;
        if (pushToken)
            await this.sendNotification([pushToken], notificationMessage);
    }
    async sendChatMessageNotification(message) {
        try {
            const user = await user_service_1.userService.getUserById(`${message.receiver}`);
            if (!user)
                return;
            const pushToken = user?.deviceToken;
            if (pushToken)
                await this.sendNotification([pushToken], {
                    title: user.firstname,
                    body: message.content
                        ? message.content
                        : message?.audio
                            ? '🎙️ voice message'
                            : message?.mediaUrls
                                ? `🗾 ${message.mediaUrls.length} image${message.mediaUrls.length > 1 ? 's' : ''}`
                                : 'New Message'
                });
        }
        catch (err) {
            console.error('An error occurred while sending chat push notifications:', err);
        }
    }
}
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map