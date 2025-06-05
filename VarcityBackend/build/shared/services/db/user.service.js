"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const auth_model_1 = require("../../../features/auth/models/auth.model");
const user_interface_1 = require("../../../features/user/interfaces/user.interface");
const user_model_1 = require("../../../features/user/models/user.model");
class UserService {
    async createUser(data) {
        return await user_model_1.UserModel.create(data);
    }
    async getUserById(userId) {
        return await user_model_1.UserModel.findById(userId).populate('authId', 'email');
    }
    async getUsersByUni(uniId, skip, limit) {
        return await user_model_1.UserModel.find({ university: uniId }).skip(skip).limit(limit);
    }
    async getUsersByUniWithFilter(currentUserId, uniId, skip, limit, filter) {
        if (filter === 'all') {
            return await user_model_1.UserModel.find({ university: uniId, _id: { $ne: currentUserId } })
                .skip(skip)
                .limit(limit)
                .populate('university');
        }
        else if (filter == 'male') {
            return await user_model_1.UserModel.find({
                university: uniId,
                gender: user_interface_1.Gender.MALE,
                _id: { $ne: currentUserId }
            })
                .skip(skip)
                .limit(limit)
                .populate('university');
        }
        else {
            return await user_model_1.UserModel.find({
                university: uniId,
                gender: user_interface_1.Gender.FEMALE,
                _id: { $ne: currentUserId }
            })
                .skip(skip)
                .limit(limit)
                .populate('university');
        }
    }
    async countUserInUni(uniId) {
        return await user_model_1.UserModel.countDocuments({ university: uniId });
    }
    async countUsersInUniByFilter(currentUserId, uniId, filter) {
        if (filter === 'all') {
            return await user_model_1.UserModel.find({
                university: uniId,
                _id: { $ne: currentUserId }
            }).countDocuments();
        }
        else if (filter == 'male') {
            return await user_model_1.UserModel.find({
                university: uniId,
                gender: user_interface_1.Gender.MALE,
                _id: { $ne: currentUserId }
            }).countDocuments();
        }
        else {
            return await user_model_1.UserModel.find({
                university: uniId,
                gender: user_interface_1.Gender.FEMALE,
                _id: { $ne: currentUserId }
            }).countDocuments();
        }
    }
    async getUserByAuthId(authId) {
        return await user_model_1.UserModel.findOne({ authId }).populate('university');
    }
    async deleteUser(userId) {
        const user = await this.getUserById(userId);
        if (user) {
            await user_model_1.UserModel.deleteOne({ _id: user._id });
            await auth_model_1.AuthModel.deleteOne({ _id: user.authId });
        }
    }
    async updateNotificationSettings(userId, settings) {
        await user_model_1.UserModel.updateOne({ _id: userId }, { $set: { settings } });
    }
    async updateUser(userId, data) {
        await user_model_1.UserModel.updateOne({ _id: userId }, { $set: data });
        return await user_model_1.UserModel.findById(userId);
    }
    async searchUsers(searchTerm, uniId, limit = 20) {
        const searchRegex = new RegExp(searchTerm, 'i');
        return await user_model_1.UserModel.find({
            university: uniId,
            $or: [{ firstname: searchRegex }, { lastname: searchRegex }]
        })
            .limit(limit)
            .populate('university')
            .sort({ createdAt: -1 });
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map