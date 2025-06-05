"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniModel = void 0;
const mongoose_1 = require("mongoose");
const uniSchema = new mongoose_1.Schema({
    name: String,
    image: String,
    location: {
        address: String,
        location: {
            type: { type: String, default: 'Point', enum: ['Point'] },
            coordinates: [Number]
        }
    }
});
const UniModel = (0, mongoose_1.model)('University', uniSchema, 'University');
exports.UniModel = UniModel;
//# sourceMappingURL=uni.model.js.map