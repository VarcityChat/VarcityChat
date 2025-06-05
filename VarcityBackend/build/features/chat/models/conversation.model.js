"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const chat_interface_1 = require("../interfaces/chat.interface");
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    user1: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message', default: null },
    lastMessageTimestamp: { type: Date, default: null },
    unreadCountUser1: { type: Number, default: 0 },
    unreadCountUser2: { type: Number, default: 0 },
    status: {
        type: String,
        enum: [
            chat_interface_1.CONVERSATION_STATUS.accepted,
            chat_interface_1.CONVERSATION_STATUS.pending,
            chat_interface_1.CONVERSATION_STATUS.rejected
        ],
        default: chat_interface_1.CONVERSATION_STATUS.pending
    },
    messageSequence: { type: Number, default: 0 }
}, { timestamps: true });
conversationSchema.index({ user1: 1, user2: 1 });
exports.ConversationModel = (0, mongoose_1.model)('Conversation', conversationSchema, 'Conversation');
//# sourceMappingURL=conversation.model.js.map