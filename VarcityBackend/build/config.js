"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bunyan_1 = __importDefault(require("bunyan"));
const cloudinary_1 = __importDefault(require("cloudinary"));
dotenv_1.default.config({});
class Config {
    constructor() {
        this.DEFAULT_DB_URL = 'mongodb://db/varcity';
        this.PORT = 8000;
        this.SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT) : this.PORT;
        this.DB_URL = process.env.DB_URL || this.DEFAULT_DB_URL;
        this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';
        this.CLOUD_NAME = process.env.CLOUD_NAME || '';
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
        this.EMAIL_HOST = process.env.EMAIL_HOST || '';
        this.EMAIL_PASS = process.env.EMAIL_PASS || '';
        this.EMAIL_PORT = process.env.EMAIL_PORT || '';
        this.EMAIL_USER = process.env.EMAIL_USER || '';
    }
    validateConfig() {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined.`);
            }
        }
    }
    createLogger(name) {
        return bunyan_1.default.createLogger({ name, level: 'debug' });
    }
    cloudinaryConfig() {
        cloudinary_1.default.v2.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.CLOUD_API_KEY,
            api_secret: this.CLOUD_API_SECRET
        });
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map