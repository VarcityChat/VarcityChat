"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async me(req, res) {
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        if (!user) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'User Profile', user });
    }
    async byId(req, res) {
        const { userId } = req.params;
        const user = await user_service_1.userService.getUserById(userId);
        if (!user) {
            throw new error_handler_1.NotFoundError('User not found');
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'User Profile', user });
    }
    async search(req, res) {
        const { q, uniId } = req.query;
        const users = await user_service_1.userService.searchUsers(q, uniId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Users', users });
    }
}
exports.getUser = new Get();
//# sourceMappingURL=get-user.js.map