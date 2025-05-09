"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = void 0;
exports.uploadFile = uploadFile;
const cloudinary_1 = __importDefault(require("cloudinary"));
function uploadFile(file, folder, public_id, overwrite, invalidate) {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(file, {
            folder: folder || '',
            invalidate,
            overwrite,
            public_id,
            use_filename: true,
            resource_type: 'auto'
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
}
const uploadMultiple = async (files, folder, public_id, invalidate, overwrite) => {
    const promises = files.map((file) => uploadFile(file, folder, public_id, overwrite, invalidate));
    const results = await Promise.all(promises);
    return results;
};
exports.uploadMultiple = uploadMultiple;
//# sourceMappingURL=cloudinary-upload.js.map