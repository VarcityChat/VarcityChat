"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const chat_interface_1 = require("../../../features/chat/interfaces/chat.interface");
const conversation_model_1 = require("../../../features/chat/models/conversation.model");
const message_model_1 = require("../../../features/chat/models/message.model");
class ChatService {
    async initializeConversation(currentUserId, targetUserId) {
        const query = {
            $or: [
                { user1: currentUserId, user2: targetUserId },
                { user1: targetUserId, user2: currentUserId }
            ]
        };
        let conversation = await conversation_model_1.ConversationModel.findOne(query);
        if (!conversation) {
            conversation = await conversation_model_1.ConversationModel.create({
                user1: currentUserId,
                user2: targetUserId,
                lastMessageTimestamp: new Date()
            });
            await conversation.populate('user1 user2');
        }
        return conversation;
    }
    async acceptConversationRequest(conversationId) {
        await conversation_model_1.ConversationModel.findByIdAndUpdate(conversationId, {
            $set: { status: chat_interface_1.CONVERSATION_STATUS.accepted }
        });
    }
    async rejectConversationRequest(conversationId) {
        await conversation_model_1.ConversationModel.findByIdAndUpdate(conversationId, {
            $set: { status: chat_interface_1.CONVERSATION_STATUS.rejected }
        });
    }
    async getConversationById(conversationId) {
        return await conversation_model_1.ConversationModel.findById(conversationId);
    }
    async increaseUnreadMessageCount(sender, receiver) {
        const query = {
            $or: [
                { user1: sender, user2: receiver },
                { user1: receiver, user2: sender }
            ]
        };
        const conversation = await conversation_model_1.ConversationModel.findOne(query);
        if (conversation) {
            if (sender == conversation.user1) {
                conversation.unreadCountUser2++;
            }
            else {
                // That means the sender is the second user
                conversation.unreadCountUser1++;
            }
            await conversation.save();
        }
    }
    async updateConversationForNewMessage(sender, receiver, lastMessageTimestamp, lastMessage) {
        const query = {
            $or: [
                { user1: sender, user2: receiver },
                { user1: receiver, user2: sender }
            ]
        };
        const conversation = await conversation_model_1.ConversationModel.findOne(query);
        if (conversation) {
            if (sender == conversation.user1) {
                conversation.unreadCountUser2++;
            }
            else {
                // That means the sender is the second user
                conversation.unreadCountUser1++;
            }
            conversation.lastMessageTimestamp = lastMessageTimestamp;
            conversation.lastMessage = lastMessage;
            await conversation.save();
        }
    }
    async markConversationAsReadForUser(conversationId, user, user1Id, user2Id) {
        if (user === 'user1') {
            await conversation_model_1.ConversationModel.findByIdAndUpdate(conversationId, {
                $set: {
                    unreadCountUser1: 0
                }
            });
            // user1, then user2 should see that user1 has read his messages
            await message_model_1.MessageModel.updateMany({ conversationId, receiver: user1Id, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
        }
        else {
            await conversation_model_1.ConversationModel.findByIdAndUpdate(conversationId, {
                $set: {
                    unreadCountUser2: 0
                }
            });
            // user2, then user1 should see that user2 has read his messages
            await message_model_1.MessageModel.updateMany({ conversationId, receiver: user2Id, readAt: { $exists: false } }, { $set: { readAt: new Date() } });
        }
    }
    async addMessageToDB(message) {
        await message_model_1.MessageModel.create(message);
    }
    async getNextSequence(conversationId) {
        const result = await conversation_model_1.ConversationModel.findOneAndUpdate({ _id: conversationId }, { $inc: { messageSequence: 1 } }, { returnDocument: 'after' });
        return result?.messageSequence || 0;
    }
    // public async getConversation(): Promise<IConversationDocument | null> {}
    async getConversationList(userId) {
        const conversations = await conversation_model_1.ConversationModel.find({
            $or: [{ user1: userId }, { user2: userId }]
        })
            .populate('user1')
            .populate('user2')
            .populate('lastMessage')
            .sort({ lastMessageTimestamp: -1, createdAt: -1 })
            .lean();
        return conversations;
    }
    async getMessages(conversationId, skip = 0) {
        const messages = await message_model_1.MessageModel.find({ conversationId })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(200);
        return messages;
    }
    async getMessagesSinceSequence(conversationId, sequence, skip = 0) {
        const messages = await message_model_1.MessageModel.find({ conversationId, sequence: { $gt: sequence } })
            .sort({ sequence: 1 })
            .skip(skip)
            .limit(500);
        return messages;
    }
    async getMessagesSince(conversationId, date, skip = 0) {
        const messages = await message_model_1.MessageModel.find({ conversationId, createdAt: { $gte: date } })
            .sort({ sequence: 1 })
            .skip(skip)
            .limit(500);
        return messages;
    }
}
exports.chatService = new ChatService();
//# sourceMappingURL=chat.service.js.map