"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = void 0;
const notification_service_1 = require("../../../shared/services/db/notification.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    async markAllUserNotificationsAsRead(req, res) {
        const { userId } = req.params;
        await notification_service_1.notificationService.markAllUserNotificationsAsRead(userId);
        res.status(http_status_codes_1.default.OK).json({ message: 'All notifications marked as read' });
    }
}
exports.updateNotification = new Update();
//# sourceMappingURL=update-notification.js.map