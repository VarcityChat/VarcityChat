"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnis = void 0;
const uni_service_1 = require("../../../shared/services/db/uni.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async unis(req, res) {
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = page > 0 ? page * limit : 0;
        const unis = await uni_service_1.uniService.getUniversities(skip, limit);
        res.status(http_status_codes_1.default.OK).json({ message: 'Universities', unis });
    }
}
exports.getUnis = new Get();
//# sourceMappingURL=get-uni.js.map