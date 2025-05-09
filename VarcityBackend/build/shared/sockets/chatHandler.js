"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHandler = void 0;
const chat_interface_1 = require("../../features/chat/interfaces/chat.interface");
const chat_queue_1 = require("../services/queues/chat.queue");
const chat_service_1 = require("../services/db/chat.service");
const chat_scheme_1 = require("../../features/chat/schemes/chat.scheme");
const config_1 = require("../../config");
const mongodb_1 = require("mongodb");
const log = config_1.config.createLogger('ChatSocket Handler');
class ChatHandler {
    constructor(socket) {
        this.socket = socket;
    }
    handle() {
        /**
         * Handle Incoming Message Event
         *
         */
        this.socket.on('new-message', async (message, callback) => {
            console.log('\nMESSAGE COMING IN:', message);
            // validate the message to ensure it contains required field (especially localID and conversationID)
            const error = await this.validateChatMessage(message);
            if (error) {
                log.error('Validation Error:', error.details);
                this.socket.emit('validation-error', {
                    message: 'Validation Failed',
                    details: error.details
                });
                callback({ success: false });
                return;
            }
            // don't continue processing if conversation hasn't been accepted by the receiver
            if (message.conversationStatus === chat_interface_1.CONVERSATION_STATUS.pending) {
                const conversation = await chat_service_1.chatService.getConversationById(`${message.conversationId}`);
                if (!conversation) {
                    return;
                }
            }
            // create server timestamp and objectId for the message
            const createdAt = new Date();
            const messageObjectID = new mongodb_1.ObjectId();
            const sequence = await chat_service_1.chatService.getNextSequence(`${message.conversationId}`);
            message['sequence'] = sequence;
            message['createdAt'] = createdAt;
            // update the unread users account in a queue
            chat_queue_1.conversationQueue.addConversationJob(chat_queue_1.ConversationJobs.updateConversationForNewMessage, {
                value: {
                    sender: message.sender,
                    receiver: message.receiver,
                    lastMessageTimestamp: message.createdAt,
                    lastMessage: `${messageObjectID}`
                }
            });
            // add the message to db in a queue
            chat_queue_1.chatQueue.addChatJob(chat_queue_1.ChatJobs.addChatMessageToDB, {
                value: { ...message, _id: messageObjectID }
            });
            // TODO: send notification to user using queue
            console.log('SENDING MESSAGE TO RECEIVER:', message.receiver);
            // emit event to the receiver with acknowledgment of (success: true) to the message sender
            this.socket
                .to(`${message.receiver}`)
                .emit('new-message', { _id: messageObjectID, ...message });
            if (callback) {
                callback({
                    success: true,
                    serverId: messageObjectID,
                    localId: message.localId,
                    serverSequence: message.sequence,
                    messageCreatedAt: createdAt
                });
            }
        });
        this.socket.on('typing', (data) => {
            this.socket.to(`${data.receiverId}`).emit('typing', data);
        });
        this.socket.on('stop-typing', (data) => {
            this.socket.to(`${data.receiverId}`).emit('stop-typing', data);
        });
        this.socket.on('mark-conversation-as-read', async (data) => {
            const { conversationId, userId, user1Id, user2Id } = data;
            // userId: id of the current authenticated user
            // user1Id: id of the conversation user1
            // user2Id: id of the conversation user2
            if (!conversationId ||
                !userId ||
                !user1Id ||
                !user2Id ||
                (userId !== user1Id && userId !== user2Id)) {
                return;
            }
            const receiverId = userId === user1Id ? user2Id : user1Id;
            await chat_service_1.chatService.markConversationAsReadForUser(`${conversationId}`, userId === user1Id ? 'user1' : 'user2', `${user1Id}`, `${user2Id}`);
            this.socket.to(`${receiverId}`).emit('user-read-messages', {
                conversationId
            });
        });
    }
    validateChatMessage(message) {
        const { error } = chat_scheme_1.addChatSchema.validate(message);
        return Promise.resolve(error);
    }
}
exports.ChatHandler = ChatHandler;
//# sourceMappingURL=chatHandler.js.map