"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const config_1 = require("./config");
const redis_connection_1 = require("./shared/services/redis/redis.connection");
const setupDb_1 = __importDefault(require("./setupDb"));
const log = config_1.config.createLogger('app');
class Application {
    init() {
        this.loadConfig();
        (0, setupDb_1.default)();
        const app = (0, express_1.default)();
        const server = new server_1.VarcityServer(app);
        server.start();
        this.handleExit();
    }
    loadConfig() {
        config_1.config.validateConfig();
        config_1.config.cloudinaryConfig();
    }
    handleExit() {
        process.on('uncaughtException', (error) => {
            log.error('There was an uncaught error', error);
            this.shutDownProperly(1);
        });
        process.on('unhandledRejection', (reason) => {
            log.error(`\nUnhandled reject at promise: ${reason}`);
            this.shutDownProperly(2);
        });
        process.on('SIGTERM', () => {
            log.error('Caught SIGTERM');
            this.shutDownProperly(1);
        });
        process.on('SIGINT', () => {
            log.error('Caught SigInt');
            this.shutDownProperly(1);
        });
        process.on('exit', () => {
            log.error('Exiting...');
        });
    }
    async shutDownProperly(exitCode) {
        try {
            await redis_connection_1.redisConnection.closeConnection();
            process.exit(exitCode);
        }
        catch (error) {
            log.error(`Error while shutting down: ${error}`);
            process.exit(1);
        }
    }
}
const application = new Application();
application.init();
//# sourceMappingURL=app.js.map