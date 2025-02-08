import { CONVERSATION_STATUS, IConversationDocument } from '@chat/interfaces/chat.interface';
import { Model, Schema, model } from 'mongoose';

const conversationSchema = new Schema<IConversationDocument>(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    lastMessageTimestamp: { type: Date, default: null },
    unreadCountUser1: { type: Number, default: 0 },
    unreadCountUser2: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        CONVERSATION_STATUS.accepted,
        CONVERSATION_STATUS.pending,
        CONVERSATION_STATUS.rejected
      ],
      default: CONVERSATION_STATUS.pending
    },
    messageSequence: { type: Number, default: 0 }
  },
  { timestamps: true }
);

conversationSchema.index({ user1: 1, user2: 1 });

export const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>(
  'Conversation',
  conversationSchema,
  'Conversation'
);
