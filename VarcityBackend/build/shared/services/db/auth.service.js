"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const auth_model_1 = require("../../../features/auth/models/auth.model");
class AuthService {
    async createAuthUser(data) {
        return await auth_model_1.AuthModel.create(data);
    }
    async getUserByEmail(email) {
        return await auth_model_1.AuthModel.findOne({ email });
    }
    async updatePasswordToken(authId, otp, otpExpiration) {
        await auth_model_1.AuthModel.updateOne({ _id: authId }, {
            passwordResetToken: otp,
            passwordResetExpiresIn: otpExpiration
        });
    }
    async getAuthUserByPasswordToken(email, otp) {
        return await auth_model_1.AuthModel.findOne({
            email,
            passwordResetToken: otp
        });
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map