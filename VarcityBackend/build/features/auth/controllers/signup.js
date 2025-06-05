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
exports.signup = void 0;
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const auth_service_1 = require("../../../shared/services/db/auth.service");
const signup_1 = require("../schemes/signup");
const user_service_1 = require("../../../shared/services/db/user.service");
const uni_service_1 = require("../../../shared/services/db/uni.service");
const cloudinary_1 = require("cloudinary");
const config_1 = require("../../../config");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class SignUp {
    async create(req, res) {
        const { email, password, course, university, gender, mobileNumber, firstname, lastname, relationshipStatus, lookingFor, images, about } = req.body;
        const userExists = await auth_service_1.authService.getUserByEmail(helpers_1.Helpers.lowerCase(email));
        if (userExists) {
            throw new error_handler_1.BadRequestError('User already exists');
        }
        const uni = await uni_service_1.uniService.getUniByID(university);
        if (!uni) {
            throw new error_handler_1.BadRequestError('We do not support this university at the time.');
        }
        // Images Upload
        // const uploadedImages: IUserImage[] = [];
        // if (images) {
        //   const imageResponses: UploadApiResponse[] = (await uploadMultiple(
        //     images,
        //     'varcity/user_profiles',
        //     '',
        //     true,
        //     true
        //   )) as UploadApiResponse[];
        //   imageResponses.forEach((response) => {
        //     if (!response.public_id) {
        //       throw new BadRequestError('An error occurred while uploading images');
        //     }
        //     uploadedImages.push({ url: response.secure_url, public_id: response.public_id });
        //   });
        // }
        const authData = {
            email: `${email}`.toLowerCase(),
            password
        };
        const authUser = (await auth_service_1.authService.createAuthUser(authData));
        const userData = {
            email: helpers_1.Helpers.lowerCase(email),
            authId: authUser._id,
            firstname,
            lastname,
            university: uni._id,
            mobileNumber,
            course,
            gender,
            images,
            relationshipStatus,
            lookingFor,
            expoPushToken: '',
            about
        };
        const user = (await user_service_1.userService.createUser(userData));
        user.university = uni;
        const jwtPayload = {
            email,
            userId: user._id
        };
        const authToken = helpers_1.Helpers.signToken(jwtPayload);
        res.status(http_status_codes_1.default.OK).json({ message: 'Account created', token: authToken, user });
    }
    async userExists(req, res) {
        const authUser = await auth_service_1.authService.getUserByEmail(req.query.email.toLowerCase());
        res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'Existence Status', exists: authUser ? true : false });
    }
    async getSignedUploadUrl(req, res) {
        const folder = 'varcity/user_profiles';
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary_1.v2.utils.api_sign_request({ timestamp, folder }, config_1.config.CLOUD_API_SECRET);
        res.status(http_status_codes_1.default.OK).json({
            cloudName: config_1.config.CLOUD_NAME,
            apiKey: config_1.config.CLOUD_API_KEY,
            timestamp,
            signature,
            folder
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(signup_1.signupSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignUp.prototype, "create", null);
exports.signup = new SignUp();
//# sourceMappingURL=signup.js.map