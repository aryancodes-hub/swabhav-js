const AdminService = require("./admin.service");

class AdminController {
    constructor() {
        this.adminService = new AdminService();
    }

    // Users
    async listUsers(req, res, next) {
        try {
            const result = await this.adminService.listUsers(req.query, req.pagination);
            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    async getUserDetails(req, res, next) {
        try {
            const data = await this.adminService.getUserDetails(req.params.userId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async blockUser(req, res, next) {
        try {
            const data = await this.adminService.blockUser(req.params.userId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async unblockUser(req, res, next) {
        try {
            const data = await this.adminService.unblockUser(req.params.userId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            await this.adminService.deleteUser(req.params.userId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async restoreUser(req, res, next) {
        try {
            const data = await this.adminService.restoreUser(req.params.userId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    // URLs
    async listUrls(req, res, next) {
        try {
            const result = await this.adminService.listUrls(req.query, req.pagination);
            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    async getUrlDetails(req, res, next) {
        try {
            const data = await this.adminService.getUrlDetails(req.params.urlId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async deleteUrl(req, res, next) {
        try {
            await this.adminService.deleteUrl(req.params.urlId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async restoreUrl(req, res, next) {
        try {
            const data = await this.adminService.restoreUrl(req.params.urlId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    // Payments
    async listPayments(req, res, next) {
        try {
            const result = await this.adminService.listPayments(req.query, req.pagination);
            return res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentDetails(req, res, next) {
        try {
            const data = await this.adminService.getPaymentDetails(req.params.paymentId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    // Config
    async getSystemConfigs(req, res, next) {
        try {
            const data = await this.adminService.getSystemConfigs();
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateSystemConfig(req, res, next) {
        try {
            const data = await this.adminService.updateSystemConfig(req.params.key, req.body.value);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AdminController;
