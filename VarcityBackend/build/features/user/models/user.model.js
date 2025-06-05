"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../interfaces/user.interface");
const userSchema = new mongoose_1.Schema({
    authId: { type: mongoose_1.Types.ObjectId, ref: 'Auth', index: { unique: true } },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    course: { type: String, trim: true },
    gender: { type: String, enum: [user_interface_1.Gender.MALE, user_interface_1.Gender.FEMALE] },
    images: [String],
    university: { type: mongoose_1.Types.ObjectId, ref: 'University' },
    mobileNumber: { type: String, trim: true },
    relationshipStatus: {
        type: String,
        enum: [user_interface_1.RelationshipStatus.SINGLE, user_interface_1.RelationshipStatus.DATING, user_interface_1.RelationshipStatus.MARRIED],
        default: user_interface_1.RelationshipStatus.SINGLE
    },
    lookingFor: {
        type: String,
        enum: [user_interface_1.LookingFor.FRIENDSHIP, user_interface_1.LookingFor.RELATIONSHIP, user_interface_1.LookingFor.OTHERS],
        default: user_interface_1.LookingFor.OTHERS
    },
    email: String,
    deviceToken: String,
    settings: {
        notificationsEnabled: { type: Boolean, default: true },
        activeStatus: { type: Boolean, default: true }
    },
    about: String
}, {
    timestamps: true
});
userSchema.index({ firstname: 'text', lastname: 'text' });
const UserModel = (0, mongoose_1.model)('User', userSchema, 'User');
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map