"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const chat_interface_1 = require("../interfaces/chat.interface");
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    conversationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: false },
    audio: { type: String, required: false },
    mediaUrls: [String],
    mediaType: {
        type: String,
        required: false,
        enum: [chat_interface_1.MEDIA_TYPE.audio, chat_interface_1.MEDIA_TYPE.video, chat_interface_1.MEDIA_TYPE.image]
    },
    reply: {
        messageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message', required: false },
        sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        mediaType: {
            type: String,
            enum: [chat_interface_1.MEDIA_TYPE.audio, chat_interface_1.MEDIA_TYPE.video, chat_interface_1.MEDIA_TYPE.image]
        },
        mediaUrl: String
    },
    seenAt: Date,
    readAt: Date,
    localId: String,
    sequence: { type: Number, required: true },
    localSequence: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.MessageModel = (0, mongoose_1.model)('Message', messageSchema, 'Message');
//# sourceMappingURL=message.model.js.map