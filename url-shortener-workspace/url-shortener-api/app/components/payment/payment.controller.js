const PaymentService = require("./payment.service");

class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }

    async listPayments(req, res, next) {
        try {
            const result = await this.paymentService.getUserPayments(
                req.user.id,
                req.query,
                req.pagination
            );
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getPaymentById(req, res, next) {
        try {
            const payment = await this.paymentService.getPaymentById(
                req.user.id,
                req.params.paymentId
            );
            return res.status(200).json({
                success: true,
                data: payment
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PaymentController;
