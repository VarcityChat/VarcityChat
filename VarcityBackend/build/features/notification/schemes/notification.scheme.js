"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const notificationMessageSchema = joi_1.default.object().keys({
    title: joi_1.default.string().min(1).max(200).required().messages({
        'string.base': 'title must be a string',
        'string.min': 'title length is too small',
        'string.max': 'title length is too large',
        'string.empty': 'title is a required field',
        'string.required': 'title is a required field'
    }),
    message: joi_1.default.string().min(2).max(1000).required().messages({
        'string.base': 'message must be a string',
        'string.min': 'message length is too small',
        'string.max': 'message length is too large',
        'string.empty': 'message is a required field',
        'string.required': 'message is a required field'
    })
});
exports.notificationMessageSchema = notificationMessageSchema;
//# sourceMappingURL=notification.scheme.js.map