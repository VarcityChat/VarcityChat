"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const uniSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().max(60).messages({
        'string.base': 'Name must be of type string',
        'string.max': 'Name too long',
        'string.empty': 'Name is a required field'
    }),
    image: joi_1.default.string().required().messages({
        'string.base': 'Image must be of type string',
        'string.empty': 'Image is a required field'
    }),
    address: joi_1.default.string().min(1).max(200).required().messages({
        'string.base': 'Address must be of type string',
        'string.min': 'Invalid uni Address',
        'string.max': 'invalid uni Address',
        'string.empty': 'Address is a required field'
    })
});
exports.uniSchema = uniSchema;
//# sourceMappingURL=uni.scheme.js.map