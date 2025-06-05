"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const signin_1 = require("../controllers/signin");
const signup_1 = require("../controllers/signup");
const password_1 = require("../controllers/password");
class AuthRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/signin', signin_1.signin.read);
        this.router.post('/signup', signup_1.signup.create);
        this.router.post('/forgot-password', password_1.password.create);
        this.router.post('/reset-password', password_1.password.update);
        this.router.get('/user-exists', signup_1.signup.userExists);
        this.router.get('/get-cloudinary-signed-url', signup_1.signup.getSignedUploadUrl);
        return this.router;
    }
}
exports.authRoutes = new AuthRoutes();
//# sourceMappingURL=authRoutes.js.map