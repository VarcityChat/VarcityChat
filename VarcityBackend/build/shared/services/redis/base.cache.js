"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCache = void 0;
const config_1 = require("../../../config");
const redis_connection_1 = require("./redis.connection");
class BaseCache {
    constructor(cacheName) {
        this.log = config_1.config.createLogger(cacheName);
        this.client = redis_connection_1.redisConnection.getClient();
    }
}
exports.BaseCache = BaseCache;
//# sourceMappingURL=base.cache.js.map