"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = require("ioredis");
const config_1 = require("../../../config");
const log = config_1.config.createLogger('redisConnection');
class RedisConnection {
    constructor() {
        this.client = null;
    }
    static getInstance() {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }
    connect() {
        if (!this.client) {
            this.client = new ioredis_1.Redis(`${config_1.config.REDIS_HOST}`);
            this.client.on('connect', () => log.info('Redis Connected'));
            this.client.on('error', (err) => log.error('Redis Client Error', err));
        }
        return this.client;
    }
    getClient() {
        if (!this.client) {
            return this.connect();
        }
        return this.client;
    }
    async closeConnection() {
        if (this.client) {
            await this.client?.quit();
        }
    }
}
exports.redisConnection = RedisConnection.getInstance();
//# sourceMappingURL=redis.connection.js.map