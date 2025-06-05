"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const update_user_1 = require("../controllers/update-user");
const get_user_1 = require("../controllers/get-user");
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.put('/user', update_user_1.updateUser.user);
        this.router.put('/user/status', update_user_1.updateUser.updateStatus);
        this.router.put('/user/deviceToken', update_user_1.updateUser.savePushNotificationToken);
        this.router.get('/users/search', get_user_1.getUser.search);
        this.router.get('/user/:userId', get_user_1.getUser.byId);
        return this.router;
    }
}
exports.userRoutes = new UserRoutes();
//# sourceMappingURL=userRoutes.js.map