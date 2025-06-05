"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCache = void 0;
const base_cache_1 = require("./base.cache");
const config_1 = require("../../../config");
const chat_service_1 = require("../db/chat.service");
const CACHE_NAME = 'ChatCache';
const log = config_1.config.createLogger(CACHE_NAME);
class ChatCache extends base_cache_1.BaseCache {
    constructor() {
        super(CACHE_NAME);
    }
    async setUserOnline(userId) {
        try {
            const now = Date.now().toString();
            await this.client.hset(`user:${userId}`, 'status', 'online', 'lastSeen', now);
        }
        catch (error) {
            log.error(error);
        }
    }
    async setUserOffline(userId) {
        try {
            const now = Date.now().toString();
            await this.client.hset(`user:${userId}`, 'status', 'offline', 'lastSeen', now);
        }
        catch (error) {
            log.error(error);
        }
    }
    async getUserStatus(userId) {
        try {
            const userData = await this.client.hgetall(`user:${userId}`);
            return {
                status: userData?.status || 'offline',
                lastSeen: userData?.lastSeen || ''
            };
        }
        catch (error) {
            log.error(error);
            return { status: 'offline', lastSeen: '' };
        }
    }
    async addUserConversationPartner(userId, partner) {
        try {
            await this.client.sadd(`user:${userId}:partners`, JSON.stringify(partner));
        }
        catch (error) {
            log.error(error);
        }
    }
    async setUserConversationPartners(userId, partners) {
        try {
            await this.client.sadd(`user:${userId}:partners`, ...partners.map((partner) => JSON.stringify(partner)));
        }
        catch (error) {
            log.error(error);
        }
    }
    async getUserConversationPartners(userId) {
        try {
            const cachedPartners = await this.client.smembers(`user:${userId}:partners`);
            if (cachedPartners && cachedPartners.length > 0) {
                return cachedPartners.map((partner) => JSON.parse(partner));
            }
            const conversationList = await chat_service_1.chatService.getConversationList(userId);
            if (conversationList.length > 0) {
                const partners = conversationList.map((conversation) => {
                    return {
                        _id: conversation._id.toString(),
                        user1: conversation.user1._id.toString(),
                        user2: conversation.user2._id.toString(),
                        status: conversation.status
                    };
                });
                await this.setUserConversationPartners(userId, partners);
                return partners;
            }
            return [];
        }
        catch (error) {
            log.error(error);
            return [];
        }
    }
    async updateUserActivity(userId) {
        try {
            await this.client.hset(`user:${userId}`, 'lastActive', Date.now().toString());
        }
        catch (error) {
            log.error(error);
        }
    }
}
exports.ChatCache = ChatCache;
//# sourceMappingURL=chat.cache.js.map