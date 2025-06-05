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
exports.updateUser = void 0;
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_service_1 = require("../../../shared/services/db/user.service");
const user_scheme_1 = require("../schemes/user.scheme");
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    async user(req, res) {
        const { firstname, lastname, images, about, relationshipStatus, lookingFor, mobileNumber, course } = req.body;
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        if (!user)
            throw new error_handler_1.NotFoundError('User not found');
        if (user._id.toString() !== req.currentUser.userId.toString()) {
            throw new error_handler_1.BadRequestError('You are not authorized to update this user');
        }
        const dataToUpdate = {
            firstname: user.firstname,
            lastname: user.lastname,
            images: user.images,
            about: user.about,
            relationshipStatus: user.relationshipStatus,
            lookingFor: user.lookingFor,
            mobileNumber: user.mobileNumber,
            course: user.course
        };
        if (firstname)
            dataToUpdate.firstname = firstname;
        if (lastname)
            dataToUpdate.lastname = lastname;
        if (images)
            dataToUpdate.images = images;
        if (about)
            dataToUpdate.about = about;
        if (relationshipStatus)
            dataToUpdate.relationshipStatus = relationshipStatus;
        if (lookingFor)
            dataToUpdate.lookingFor = lookingFor;
        if (mobileNumber)
            dataToUpdate.mobileNumber = mobileNumber;
        if (course)
            dataToUpdate.course = course;
        const updatedUser = await user_service_1.userService.updateUser(req.currentUser.userId, dataToUpdate);
        res.status(http_status_codes_1.default.OK).json({ message: 'User updated successfully', updatedUser });
    }
    async updateStatus(req, res) {
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        if (!user)
            throw new error_handler_1.NotFoundError('User not found');
        const body = req.body;
        user.settings.activeStatus = body.activeStatus;
        user.settings.notificationsEnabled = body.notificationsEnabled;
        await user_service_1.userService.updateNotificationSettings(req.currentUser.userId, body);
        res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'User status updated successfully', updatedUser: user });
    }
    /**
     * @param
     * @desc defines the endpoint to store expo push token
     */
    // @validator(savePushTokenSchema)
    async savePushNotificationToken(req, res) {
        const { deviceToken } = req.body;
        console.log('\nDEVICE TOKEN:', deviceToken);
        if (expo_server_sdk_1.default.isExpoPushToken(deviceToken)) {
            await user_service_1.userService.updateUser(req.currentUser.userId, { deviceToken });
            res.status(http_status_codes_1.default.OK).json({ message: 'PushToken saved successfully' });
        }
        else {
            throw new error_handler_1.BadRequestError('Invalid Push Token');
        }
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(user_scheme_1.updateUserSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "user", null);
exports.updateUser = new Update();
//# sourceMappingURL=update-user.js.map