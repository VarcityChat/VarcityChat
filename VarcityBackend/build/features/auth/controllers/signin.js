"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = void 0;
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const signin_1 = require("../schemes/signin");
const auth_service_1 = require("../../../shared/services/db/auth.service");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_service_1 = require("../../../shared/services/db/user.service");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class SignIn {
    async read(req, res) {
        const { email, password } = req.body;
        const authUser = await auth_service_1.authService.getUserByEmail(email);
        if (!authUser) {
            throw new error_handler_1.BadRequestError('Invalid credentials');
        }
        const passwordsMatch = await authUser.comparePassword(password);
        if (!passwordsMatch) {
            throw new error_handler_1.BadRequestError('Invalid credentials');
        }
        const user = await user_service_1.userService.getUserByAuthId(`${authUser._id}`);
        if (!user) {
            throw new error_handler_1.BadRequestError('Invalid credentials');
        }
        const signedToken = helpers_1.Helpers.signToken({
            userId: user._id,
            email: authUser.email
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'User login successful', token: signedToken, user });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(signin_1.loginSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignIn.prototype, "read", null);
exports.signin = new SignIn();
//# sourceMappingURL=signin.js.map