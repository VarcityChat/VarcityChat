import { IMessageDocument, MEDIA_TYPE } from '@chat/interfaces/message.interface';
import { Model, model, Schema } from 'mongoose';

const messageSchema: Schema = new Schema<IMessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: false },
    mediaUrl: {
      type: String,
      required: false
    },
    mediaType: {
      type: String,
      required: false,
      enum: [MEDIA_TYPE.audio, MEDIA_TYPE.video, MEDIA_TYPE.image]
    },
    seenAt: Date,
    readAt: Date
  },
  { timestamps: true }
);

export const MessageModel: Model<IMessageDocument> = model<IMessageDocument>(
  'Message',
  messageSchema,
  'Message'
);
