"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOUserHandler = exports.ioInstance = void 0;
const chatHandler_1 = require("./chatHandler");
const config_1 = require("../../config");
const chat_cache_1 = require("../services/redis/chat.cache");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const log = config_1.config.createLogger('SocketIOUserHandler');
class SocketIOUserHandler {
    constructor(io) {
        this.io = io;
        exports.ioInstance = io;
        this.chatCache = new chat_cache_1.ChatCache();
    }
    listen() {
        this.io.use(async (socket, next) => {
            const authToken = socket.handshake.auth.authToken ||
                socket.handshake.headers.authorization;
            if (!authToken) {
                return next(new Error('No AuthToken provided'));
            }
            try {
                const user = jsonwebtoken_1.default.verify(authToken, config_1.config.JWT_TOKEN);
                socket.user = user;
                next();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (error) {
                return next(new Error('Invalid AuthToken provided'));
            }
        });
        this.io.on('connection', async (socket) => {
            const user = socket.user;
            log.info('\nUser connected', user);
            this.io.emit('user-connected', user.userId);
            // Set user as online
            if (user.userId) {
                await this.chatCache.setUserOnline(user.userId);
                this.sendStatusToConversationPartners(user.userId, 'online');
                // The user joins the room with their userId
                socket.join(user.userId);
                // Pass the socket to the ChatHandler
                new chatHandler_1.ChatHandler(socket).handle();
                socket.on('get-user-activity', async (userId) => {
                    const userStatus = await this.chatCache.getUserStatus(userId);
                    socket.emit('user-status-changed', { userId, ...userStatus });
                });
                socket.on('disconnect', async () => {
                    this.io.emit('user-disconnected', user.userId);
                    console.log('user disconnected');
                    await this.chatCache.setUserOffline(user.userId);
                    await this.sendStatusToConversationPartners(user.userId, 'offline');
                });
            }
        });
    }
    async sendStatusToConversationPartners(userId, status) {
        const partners = await this.chatCache.getUserConversationPartners(userId);
        partners.forEach((partner) => {
            let partnerId;
            if (partner.user1 === userId) {
                partnerId = partner.user2;
            }
            else {
                partnerId = partner.user1;
            }
            this.io.to(partnerId).emit('user-status-changed', {
                userId: partnerId,
                status,
                lastSeen: Date.now().toString()
            });
        });
    }
}
exports.SocketIOUserHandler = SocketIOUserHandler;
//# sourceMappingURL=user.js.map