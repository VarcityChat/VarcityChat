"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarcityServer = void 0;
const express_1 = require("express");
const error_handler_1 = require("./shared/globals/helpers/error-handler");
const config_1 = require("./config");
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_connection_1 = require("./shared/services/redis/redis.connection");
const user_1 = require("./shared/sockets/user");
const routes_1 = __importDefault(require("./routes"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const SERVER_PORT = 8000;
const log = config_1.config.createLogger('Server');
class VarcityServer {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }
    securityMiddleware(app) {
        app.disable('x-powered-by');
        app.use((0, cookie_session_1.default)({
            name: 'session',
            keys: ['test', 'test2'],
            maxAge: 24 * 7 * 3600000
        }));
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, express_mongo_sanitize_1.default)());
        app.use((0, cors_1.default)({
            origin: '*',
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }));
    }
    standardMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: '50mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    }
    routesMiddleware(app) {
        (0, routes_1.default)(app);
        app.get('/', async (req, res) => {
            res.send('Ping from Varcity Backend');
        });
    }
    globalErrorHandler(app) {
        app.all('*', (req, res) => {
            res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
        });
        app.use((err, req, res, next) => {
            log.error(err);
            if (err instanceof error_handler_1.CustomError) {
                res.status(err.statusCode).json(err.serializeErrors());
            }
            else {
                next();
            }
        });
    }
    async startServer(app) {
        try {
            const httpServer = new http_1.default.Server(app);
            const socketIO = await this.createSocketIO(httpServer);
            this.startHttpServer(httpServer);
            this.socketIOConnections(socketIO);
        }
        catch (error) {
            log.error(error);
        }
    }
    async createSocketIO(httpServer) {
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        });
        const pubClient = redis_connection_1.redisConnection.connect();
        const subClient = pubClient.duplicate();
        io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        return io;
    }
    startHttpServer(httpServer) {
        log.info(`Server has started with process id ${process.pid}`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Server running on port ${SERVER_PORT}`);
        });
    }
    socketIOConnections(io) {
        const userSocketHandler = new user_1.SocketIOUserHandler(io);
        userSocketHandler.listen();
    }
}
exports.VarcityServer = VarcityServer;
//# sourceMappingURL=server.js.map