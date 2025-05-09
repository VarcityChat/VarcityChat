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
exports.createChat = void 0;
const chat_scheme_1 = require("../schemes/chat.scheme");
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_1 = require("../../../shared/sockets/user");
const chat_service_1 = require("../../../shared/services/db/chat.service");
const notification_service_1 = require("../../../shared/services/db/notification.service");
const user_service_1 = require("../../../shared/services/db/user.service");
const chat_cache_1 = require("../../../shared/services/redis/chat.cache");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const chatCache = new chat_cache_1.ChatCache();
class Add {
    async conversation(req, res) {
        const { targetUserId } = req.body;
        if (!targetUserId)
            throw new error_handler_1.BadRequestError('userId is required');
        const targetUser = await user_service_1.userService.getUserById(targetUserId);
        if (!targetUser)
            throw new error_handler_1.NotFoundError('Target User does not exist');
        const currentAuthUser = await user_service_1.userService.getUserById(req.currentUser.userId);
        const conversation = await chat_service_1.chatService.initializeConversation(req.currentUser.userId, targetUserId);
        await notification_service_1.notificationService.saveNotificationToDb(targetUserId, {
            body: `${currentAuthUser?.firstname}: sent you a new message request`,
            title: 'New Message Request'
        }, `${req.currentUser.userId}`);
        user_1.ioInstance.to(targetUserId).emit('new-message-request', {
            conversationId: conversation._id,
            targetUserId,
            targetUser,
            fromUser: currentAuthUser
        });
        user_1.ioInstance.to(targetUserId).emit('new-notification', {
            conversationId: conversation._id,
            targetUserId,
            targetUser,
            fromUser: currentAuthUser
        });
        // Add user to conversation partners
        await chatCache.addUserConversationPartner(req.currentUser.userId, {
            _id: conversation._id.toString(),
            user1: req.currentUser.userId,
            user2: targetUserId,
            status: conversation.status
        });
        // TODO: send push notification to 'targetUserId' informing on new message request
        res.status(http_status_codes_1.default.CREATED).json({ message: 'Conversation created', conversation });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(chat_scheme_1.addConversationSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Add.prototype, "conversation", null);
exports.createChat = new Add();
//# sourceMappingURL=create-chat.js.map