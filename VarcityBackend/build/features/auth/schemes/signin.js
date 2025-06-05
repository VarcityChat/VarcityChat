"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required().email().messages({
        'string.base': 'Enter a valid email',
        'string.required': 'Enter a valid email',
        'string.email': 'Enter a valid email'
    }),
    password: joi_1.default.string().required().min(3).max(30).messages({
        'string.base': 'Password must be of type string',
        'string.min': 'Invalid password',
        'string.max': 'Invalid password',
        'string.empty': 'Password is a required field'
    })
});
exports.loginSchema = loginSchema;
//# sourceMappingURL=signin.js.map