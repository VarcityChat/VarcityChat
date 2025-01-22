import { INotificationDocument } from '@notification/interfaces/notification.interface';
import { Schema, model, Model } from 'mongoose';

const notificationSchema = new Schema(
  {
    message: { type: String, required: true },
    title: { type: String, required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    read: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const NotificationModel: Model<INotificationDocument> = model<INotificationDocument>(
  'Notification',
  notificationSchema,
  'Notification'
);
export { NotificationModel };
