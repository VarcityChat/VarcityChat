"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const log = config_1.config.createLogger('setupDatabase');
exports.default = () => {
    const connect = () => {
        mongoose_1.default
            .connect(`${process.env.DB_URL}`)
            .then(() => {
            log.info('Successfully connected to database.');
        })
            .catch((error) => {
            log.error('Error connecting to database.', error);
            return process.exit(1);
        });
    };
    connect();
    mongoose_1.default.connection.on('disconnect', connect);
};
//# sourceMappingURL=setupDb.js.map