"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const chat_service_1 = require("../../../shared/services/db/chat.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async conversationList(req, res) {
        const userId = req.currentUser.userId;
        const list = await chat_service_1.chatService.getConversationList(userId);
        res.status(http_status_codes_1.default.OK).json({ message: 'User Conversations', list });
    }
    async messages(req, res) {
        const { conversationId } = req.params;
        let messages = [];
        messages = await chat_service_1.chatService.getMessages(conversationId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Chat Messages', messages });
    }
    async messagesBySequence(req, res) {
        const { conversationId } = req.params;
        const { sequence } = req.query;
        let messages = [];
        messages = await chat_service_1.chatService.getMessagesSinceSequence(conversationId, parseInt(sequence));
        res.status(http_status_codes_1.default.OK).json({ message: 'Chat Messages', messages });
    }
    async messagesSince(req, res) {
        const { conversationId } = req.params;
        const { date } = req.query;
        const sinceDate = new Date(date);
        if (isNaN(sinceDate.getTime())) {
            throw new error_handler_1.BadRequestError('Invalid date format');
        }
        let messages = [];
        messages = await chat_service_1.chatService.getMessagesSince(conversationId, sinceDate);
        res.status(http_status_codes_1.default.OK).json({ message: 'Chat Messages', messages });
    }
}
exports.getChats = new Get();
//# sourceMappingURL=get-chats.js.map