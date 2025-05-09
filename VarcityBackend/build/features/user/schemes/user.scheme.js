"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const user_interface_1 = require("../interfaces/user.interface");
const joi_1 = __importDefault(require("joi"));
const updateUserSchema = joi_1.default.object().keys({
    firstname: joi_1.default.string().max(60).messages({
        'string.base': 'First name must be of type string',
        'string.max': 'Name too long',
        'string.empty': 'First name is a required field'
    }),
    lastname: joi_1.default.string().max(60).messages({
        'string.base': 'Last name must be of type string',
        'string.max': 'Name too long',
        'string.empty': 'Last name is a required field'
    }),
    images: joi_1.default.array().max(5).messages({
        'array.base': 'Images must be of type array',
        'array.min': 'invalid array length',
        'array.max': 'invalid array length'
    }),
    mobileNumber: joi_1.default.string().max(20).messages({
        'string.base': 'Mobile Number must be of type string',
        'string.max': 'Mobile Number too long'
    }),
    course: joi_1.default.string().optional().max(60).messages({
        'string.base': 'Course must be of type string',
        'string.max': 'Course name too long',
        'string.empty': 'Course is a required field'
    }),
    relationshipStatus: joi_1.default.string()
        .allow(user_interface_1.RelationshipStatus.SINGLE, user_interface_1.RelationshipStatus.DATING, user_interface_1.RelationshipStatus.MARRIED)
        .max(40)
        .messages({
        'string.base': 'Relationship Status must be of type string',
        'string.empty': 'Please select your relationship status'
    }),
    lookingFor: joi_1.default.string().max(40).messages({
        'string.base': 'Looking for must be of type string'
    }),
    about: joi_1.default.string().max(250).messages({
        'string.base': 'About must be of type string'
    }),
    hobbies: joi_1.default.array().max(10).messages({
        'array.base': 'hobbies must be of type array',
        'array.max': 'Too many hobbies selected'
    })
});
exports.updateUserSchema = updateUserSchema;
//# sourceMappingURL=user.scheme.js.map