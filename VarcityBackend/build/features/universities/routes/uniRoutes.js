"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniRoutes = void 0;
const express_1 = __importDefault(require("express"));
const create_uni_1 = require("../controllers/create-uni");
const get_uni_1 = require("../controllers/get-uni");
const get_students_1 = require("../controllers/get-students");
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth.middleware");
class UniRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/unis', get_uni_1.getUnis.unis);
        this.router.post('/uni', auth_middleware_1.authMiddleware.protect, create_uni_1.createUni.uni);
        this.router.get('/uni/:uniId/students', auth_middleware_1.authMiddleware.protect, get_students_1.getStudents.students);
        return this.router;
    }
}
exports.uniRoutes = new UniRoutes();
//# sourceMappingURL=uniRoutes.js.map