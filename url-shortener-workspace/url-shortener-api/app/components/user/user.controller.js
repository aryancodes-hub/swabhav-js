const UserService = require("./user.service");

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async getProfile(req, res, next) {
        try {
            const profile = await this.userService.getProfile(req.user.id);
            return res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const updatedProfile = await this.userService.updateProfile(req.user.id, req.body);
            return res.status(200).json({
                success: true,
                data: updatedProfile
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const result = await this.userService.changePassword(req.user.id, req.body);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAvatar(req, res, next) {
        try {
            const fileBuffer = req.file ? req.file.buffer : null;
            const result = await this.userService.updateAvatar(req.user.id, fileBuffer);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAvatar(req, res, next) {
        try {
            await this.userService.deleteAvatar(req.user.id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
