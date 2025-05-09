"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const notification_service_1 = require("../../../shared/services/db/notification.service");
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const notification_scheme_1 = require("../schemes/notification.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Send {
    async toUser(req, res) {
        const { message, title } = req.body;
        const { userId } = req.params;
        await notification_service_1.notificationService.saveNotificationToDb(userId, { title, body: message });
        await notification_service_1.notificationService.sendNotificationToUser(userId, {
            title,
            body: message
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Push notification sent successfully' });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(notification_scheme_1.notificationMessageSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Send.prototype, "toUser", null);
exports.sendNotification = new Send();
//# sourceMappingURL=send-notification.js.map