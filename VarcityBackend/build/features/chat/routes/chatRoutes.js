"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const create_chat_1 = require("../controllers/create-chat");
const get_chats_1 = require("../controllers/get-chats");
const update_chat_1 = require("../controllers/update-chat");
const express_1 = __importDefault(require("express"));
class ChatRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        // Get all conversations for the authenticated user
        this.router.get('/chat/conversations', get_chats_1.getChats.conversationList);
        this.router.get('/chat/:conversationId/messages', get_chats_1.getChats.messages);
        this.router.get('/chat/:conversationId/messages/sequence', get_chats_1.getChats.messagesBySequence);
        this.router.get('/chat/:conversationId/messages/since', get_chats_1.getChats.messagesSince);
        // Open a chat with a user
        this.router.post('/chat/open', create_chat_1.createChat.conversation);
        this.router.put('/chat/accept', update_chat_1.updateChat.acceptConversationRequest);
        this.router.put('/chat/reject', update_chat_1.updateChat.rejectConversationRequest);
        return this.router;
    }
}
exports.chatRoutes = new ChatRoutes();
//# sourceMappingURL=chatRoutes.js.map