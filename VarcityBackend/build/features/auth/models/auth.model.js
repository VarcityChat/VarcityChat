"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const auth_interface_1 = require("../interfaces/auth.interface");
const bcryptjs_1 = require("bcryptjs");
const mongoose_1 = require("mongoose");
const SALT_ROUND = 11;
const authSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        index: { unique: true, partialFilterExpression: { email: { type: 'string' } } },
        sparse: true
    },
    password: { type: String, default: null },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpiresIn: Number,
    authProvider: {
        type: String,
        enum: [auth_interface_1.AuthProviders.LOCAL, auth_interface_1.AuthProviders.GOOGLE, auth_interface_1.AuthProviders.APPLE],
        default: auth_interface_1.AuthProviders.LOCAL
    },
    providerId: { type: String, default: null },
    providerData: { type: Map, of: String, default: {} }
}, {
    timestamps: true,
    toJSON: {
        transform(_, ret) {
            delete ret.password;
            return ret;
        }
    }
});
authSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await (0, bcryptjs_1.hash)(this.password, SALT_ROUND);
        this.password = hashedPassword;
    }
    next();
});
authSchema.methods.comparePassword = async function (password) {
    const hashedPassword = this.password;
    return await (0, bcryptjs_1.compare)(password, hashedPassword);
};
authSchema.methods.hashPassword = async function (password) {
    return (0, bcryptjs_1.hash)(password, SALT_ROUND);
};
const AuthModel = (0, mongoose_1.model)('Auth', authSchema, 'Auth');
exports.AuthModel = AuthModel;
//# sourceMappingURL=auth.model.js.map