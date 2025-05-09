"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
const config_1 = require("../../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Helpers {
    static lowerCase(str) {
        return str.toLowerCase();
    }
    static capitalize(str) {
        if (str.length < 2)
            return str;
        return str[0].toUpperCase() + str.substring(1);
    }
    static signToken(jwtPayload) {
        return jsonwebtoken_1.default.sign(jwtPayload, config_1.config.JWT_TOKEN);
    }
    static generateOtp(len) {
        const numbers = '0123456789';
        let otp = '';
        for (let i = 0; i < len; i++) {
            otp += Math.floor(Math.random() * numbers.length);
        }
        return otp;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map