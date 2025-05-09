"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptConversationSchema = exports.addConversationSchema = exports.addChatSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const addChatSchema = joi_1.default.object().keys({
    conversationId: joi_1.default.string().required(),
    sender: joi_1.default.string().required(),
    receiver: joi_1.default.string().required(),
    content: joi_1.default.string().optional().allow(null, ''),
    mediaUrls: joi_1.default.array().max(5).optional(),
    audio: joi_1.default.string().optional(),
    mediaType: joi_1.default.string().optional().allow(null, ''),
    reply: joi_1.default.object().optional(),
    conversationStatus: joi_1.default.string().optional(),
    localId: joi_1.default.string().required(),
    localSequence: joi_1.default.number()
});
exports.addChatSchema = addChatSchema;
const addConversationSchema = joi_1.default.object().keys({
    targetUserId: joi_1.default.string().required()
});
exports.addConversationSchema = addConversationSchema;
const acceptConversationSchema = joi_1.default.object().keys({
    conversationId: joi_1.default.string().required()
});
exports.acceptConversationSchema = acceptConversationSchema;
//# sourceMappingURL=chat.scheme.js.map