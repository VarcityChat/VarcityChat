"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniService = void 0;
const uni_model_1 = require("../../../features/universities/models/uni.model");
class UniService {
    async createUni(data) {
        return await uni_model_1.UniModel.create(data);
    }
    async getUniByName(name) {
        return await uni_model_1.UniModel.findOne({ name: name.toLowerCase() });
    }
    async getUniByID(uniId) {
        return await uni_model_1.UniModel.findOne({ _id: uniId });
    }
    async getUniversities(skip, limit) {
        const unis = await uni_model_1.UniModel.find({}).skip(skip).limit(limit);
        return unis;
    }
}
exports.uniService = new UniService();
//# sourceMappingURL=uni.service.js.map