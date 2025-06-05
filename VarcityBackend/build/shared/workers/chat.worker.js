"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationWorker = exports.chatWorker = void 0;
const config_1 = require("../../config");
const chat_service_1 = require("../services/db/chat.service");
const notification_service_1 = require("../services/db/notification.service");
const log = config_1.config.createLogger('chatWorker');
class ChatWorker {
    async addChatMessageToDB(job, done) {
        try {
            const { value } = job.data;
            await chat_service_1.chatService.addMessageToDB(value);
            await notification_service_1.notificationService.sendChatMessageNotification(value);
            job.progress(100);
            done(null, job.data);
        }
        catch (error) {
            log.error(error);
            done(error);
        }
    }
}
class ConversationWorker {
    async increaseUnreadMessageCount(job, done) {
        try {
            const { value } = job.data;
            await chat_service_1.chatService.increaseUnreadMessageCount(`${value.sender}`, `${value.receiver}`);
            job.progress(100);
            done(null, job.data);
        }
        catch (error) {
            log.error(error);
            done(error);
        }
    }
    async updateConversationForNewMessage(job, done) {
        try {
            const { value } = job.data;
            await chat_service_1.chatService.updateConversationForNewMessage(`${value.sender}`, `${value.receiver}`, value.lastMessageTimestamp, value.lastMessage);
            job.progress(100);
            done(null, job.data);
        }
        catch (error) {
            log.error(error);
            done(error);
        }
    }
}
exports.chatWorker = new ChatWorker();
exports.conversationWorker = new ConversationWorker();
//# sourceMappingURL=chat.worker.js.map