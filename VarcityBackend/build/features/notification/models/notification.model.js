"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    title: { type: String, required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
    read: { type: Boolean, default: false }
}, {
    timestamps: true
});
const NotificationModel = (0, mongoose_1.model)('Notification', notificationSchema, 'Notification');
exports.NotificationModel = NotificationModel;
//# sourceMappingURL=notification.model.js.map