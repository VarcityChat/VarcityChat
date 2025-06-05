"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationQueue = exports.chatQueue = exports.ConversationJobs = exports.ChatJobs = void 0;
const chat_worker_1 = require("../../workers/chat.worker");
const base_queue_1 = require("./base.queue");
var ChatJobs;
(function (ChatJobs) {
    ChatJobs["addChatMessageToDB"] = "addChatMessageToDB";
})(ChatJobs || (exports.ChatJobs = ChatJobs = {}));
var ConversationJobs;
(function (ConversationJobs) {
    ConversationJobs["increaseUnreadCount"] = "increaseUnreadCount";
    ConversationJobs["updateConversationForNewMessage"] = "updateConversationForNewMessage";
})(ConversationJobs || (exports.ConversationJobs = ConversationJobs = {}));
class ChatQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('ChatMessages');
        this.processJob(ChatJobs.addChatMessageToDB, 10, chat_worker_1.chatWorker.addChatMessageToDB.bind(chat_worker_1.chatWorker));
    }
    addChatJob(name, data) {
        this.addJob(name, data);
    }
}
class ConversationQueue extends base_queue_1.BaseQueue {
    constructor() {
        super('Conversations');
        this.processJob(ConversationJobs.increaseUnreadCount, 10, chat_worker_1.conversationWorker.increaseUnreadMessageCount);
        this.processJob(ConversationJobs.updateConversationForNewMessage, 10, chat_worker_1.conversationWorker.updateConversationForNewMessage);
    }
    addConversationJob(name, data) {
        this.addJob(name, data);
    }
}
exports.chatQueue = new ChatQueue();
exports.conversationQueue = new ConversationQueue();
//# sourceMappingURL=chat.queue.js.map