"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = require("./features/auth/routes/authRoutes");
const uniRoutes_1 = require("./features/universities/routes/uniRoutes");
const notificationRoutes_1 = require("./features/notification/routes/notificationRoutes");
const auth_middleware_1 = require("./shared/globals/middlewares/auth.middleware");
const chatRoutes_1 = require("./features/chat/routes/chatRoutes");
const base_queue_1 = require("./shared/services/queues/base.queue");
const userRoutes_1 = require("./features/user/routes/userRoutes");
const BASE_PATH = '/api/v1';
exports.default = (app) => {
    const routes = () => {
        app.use('/queues', base_queue_1.serverAdapter.getRouter());
        app.use(BASE_PATH, authRoutes_1.authRoutes.routes());
        app.use(BASE_PATH, uniRoutes_1.uniRoutes.routes());
        // Enable route only in development mode
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, userRoutes_1.userRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, notificationRoutes_1.notificationRoutes.routes());
        app.use(BASE_PATH, auth_middleware_1.authMiddleware.protect, chatRoutes_1.chatRoutes.routes());
    };
    return routes();
};
//# sourceMappingURL=routes.js.map