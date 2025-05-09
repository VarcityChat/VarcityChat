"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const send_notification_1 = require("../controllers/send-notification");
const update_notification_1 = require("../controllers/update-notification");
const get_notifications_1 = require("../controllers/get-notifications");
class NotificationRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/notification/:userId/send', send_notification_1.sendNotification.toUser);
        this.router.post('/notification/:userId/mark-all-as-read', update_notification_1.updateNotification.markAllUserNotificationsAsRead);
        this.router.get('/notifications', get_notifications_1.getNotifications.userNotifications);
        return this.router;
    }
}
exports.notificationRoutes = new NotificationRoutes();
//# sourceMappingURL=notificationRoutes.js.map