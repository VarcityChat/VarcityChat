"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudents = void 0;
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async students(req, res) {
        const filter = req.query.filter || 'all';
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 30;
        const skip = (page - 1) * limit;
        const [users, usersCount] = await Promise.all([
            user_service_1.userService.getUsersByUniWithFilter(req.currentUser.userId, req.params.uniId, skip, limit, filter),
            user_service_1.userService.countUsersInUniByFilter(req.currentUser.userId, req.params.uniId, filter)
        ]);
        res.status(http_status_codes_1.default.OK).json({
            message: 'Users',
            users,
            total: usersCount,
            currentPage: page,
            totalPages: Math.ceil(usersCount / limit)
        });
    }
}
exports.getStudents = new Get();
//# sourceMappingURL=get-students.js.map