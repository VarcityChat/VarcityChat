"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const notification_service_1 = require("../../../shared/services/db/notification.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async userNotifications(req, res) {
        const notifications = await notification_service_1.notificationService.getUserNotifications(req.currentUser.userId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Notifications Fetched', notifications });
    }
}
exports.getNotifications = new Get();
//# sourceMappingURL=get-notifications.js.map