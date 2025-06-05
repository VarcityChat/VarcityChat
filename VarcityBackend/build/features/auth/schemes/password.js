"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = exports.passwordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const passwordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().min(4).max(20).messages({
        'string.base': 'Password must be of type string',
        'string.min': 'Invalid password',
        'string.max': 'Invalid password',
        'string.empty': 'Password is required'
    }),
    otp: joi_1.default.string().length(4).required().messages({
        'string.base': 'Otp must be of type string',
        'string.empty': 'Otp is a required field'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.base': 'Email must be of type string',
        'string.email': 'Invalid email',
        'string.empty': 'Email is a required field'
    })
});
exports.passwordSchema = passwordSchema;
const emailSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required().messages({
        'string.base': 'Email must be of type string',
        'string.email': 'Invalid email',
        'string.empty': 'Email is a required field'
    })
});
exports.emailSchema = emailSchema;
//# sourceMappingURL=password.js.map