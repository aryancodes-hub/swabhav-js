const QuotaService = require("./quota.service.js");

class QuotaController {
    constructor() {
        this.quotaService = new QuotaService();
    }

    async purchaseQuota(req, res, next) {
        try {
            const result = await this.quotaService.purchaseQuota(req.user.id, req.body);
            return res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyPayment(req, res, next) {
        try {
            const result = await this.quotaService.verifyRazorpayQuota(req.user.id, req.body);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = QuotaController;
