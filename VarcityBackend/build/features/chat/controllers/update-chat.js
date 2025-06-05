"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChat = void 0;
const chat_interface_1 = require("../interfaces/chat.interface");
const chat_scheme_1 = require("../schemes/chat.scheme");
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_1 = require("../../../shared/sockets/user");
const chat_service_1 = require("../../../shared/services/db/chat.service");
const notification_service_1 = require("../../../shared/services/db/notification.service");
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    async acceptConversationRequest(req, res) {
        const { conversationId } = req.body;
        const conversation = await chat_service_1.chatService.getConversationById(conversationId);
        if (!conversation)
            throw new error_handler_1.NotFoundError('Conversation does not exist');
        if (conversation.status === chat_interface_1.CONVERSATION_STATUS.rejected) {
            throw new error_handler_1.BadRequestError('Conversation request already rejected');
        }
        if (conversation.status != chat_interface_1.CONVERSATION_STATUS.pending) {
            throw new error_handler_1.BadRequestError('Cannot accept the conversation again');
        }
        if (conversation.user2.toString() !== req.currentUser?.userId) {
            throw new error_handler_1.NotAuthorizedError('You cannot accept this conversation');
        }
        const currentUser = await user_service_1.userService.getUserById(`${req.currentUser.userId}`);
        await chat_service_1.chatService.acceptConversationRequest(conversationId);
        /**
         * Send notifications to the user who initialized the conversation
         * (user1) is always the user who initialized the conversation
         */
        await notification_service_1.notificationService.saveNotificationToDb(conversation.user1.toString(), {
            body: `${currentUser?.firstname}: accepted your message request`,
            title: 'Message Request Accepted'
        }, `${req.currentUser?.userId}`);
        user_1.ioInstance.to(conversation.user1.toString()).emit('new-notification', {
            conversationId
        });
        user_1.ioInstance.to(conversation.user1.toString()).emit('accepted-conversation-request', {
            conversationId
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Message request accepted', conversation });
    }
    async rejectConversationRequest(req, res) {
        const { conversationId } = req.body;
        const conversation = await chat_service_1.chatService.getConversationById(conversationId);
        if (!conversation)
            throw new error_handler_1.NotFoundError('Conversation does not exist');
        if (conversation.status === chat_interface_1.CONVERSATION_STATUS.accepted) {
            throw new error_handler_1.BadRequestError('Conversation request already accepted');
        }
        if (conversation.user2.toString() !== req.currentUser?.userId) {
            throw new error_handler_1.NotAuthorizedError('You cannot reject this conversation');
        }
        const currentUser = await user_service_1.userService.getUserById(`${req.currentUser.userId}`);
        await chat_service_1.chatService.rejectConversationRequest(conversationId);
        /**
         * Send notifications to the user who initialized the conversation
         * (user1) is always the user who initialized the conversation
         */
        await notification_service_1.notificationService.saveNotificationToDb(conversation.user1.toString(), {
            body: `${currentUser?.firstname}: rejected your message request`,
            title: 'Message Request Rejected'
        }, `${req.currentUser?.userId}`);
        user_1.ioInstance.to(conversation.user1.toString()).emit('new-notification', {
            conversationId
        });
        user_1.ioInstance.to(conversation.user1.toString()).emit('rejected-conversation-request', {
            conversationId
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Message request rejected', conversation });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(chat_scheme_1.acceptConversationSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "acceptConversationRequest", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(chat_scheme_1.acceptConversationSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "rejectConversationRequest", null);
exports.updateChat = new Update();
//# sourceMappingURL=update-chat.js.map