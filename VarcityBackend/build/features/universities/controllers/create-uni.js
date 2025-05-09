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
exports.createUni = void 0;
const mongodb_1 = require("mongodb");
const joi_validation_decorator_1 = require("../../../shared/globals/decorators/joi-validation-decorator");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary-upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const uni_service_1 = require("../../../shared/services/db/uni.service");
const uni_scheme_1 = require("../schemes/uni.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    async uni(req, res) {
        const { name, image, address } = req.body;
        const uniExists = await uni_service_1.uniService.getUniByName(name);
        if (uniExists) {
            throw new error_handler_1.BadRequestError('University already exists');
        }
        const uniObjectId = new mongodb_1.ObjectId();
        let imageResponse = {};
        if (image) {
            try {
                const uploadResponse = await (0, cloudinary_upload_1.uploadFile)(image, 'varcity/universities');
                if (!uploadResponse?.public_id) {
                    throw new error_handler_1.BadRequestError('Error uploading image');
                }
                imageResponse = uploadResponse;
            }
            catch (error) {
                throw new error_handler_1.BadRequestError('File upload error: ' + error);
            }
        }
        const uni = await uni_service_1.uniService.createUni({
            _id: uniObjectId,
            name: name.toLowerCase().trim(),
            location: {
                address
            },
            image: imageResponse?.secure_url
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'University created successfully', uni });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(uni_scheme_1.uniSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "uni", null);
exports.createUni = new Create();
//# sourceMappingURL=create-uni.js.map