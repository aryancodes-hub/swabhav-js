const { Payment, ShortUrl } = require("@url/url-shortener-data-model");
const { NotFoundError, ForbiddenError } = require("../../lib/error.js");

class PaymentService {
    async getUserPayments(userId, query, pagination) {
        const { status, type } = query;
        const { limit, offset, page, pageSize } = pagination;
        const where = { userId };
        if (status) where.status = status;
        if (type) where.type = type;

        const {rows, count} = await Payment.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: ShortUrl,
                    as: "shortUrl",
                    attributes: ["id", "shortCode", "originalUrl"]
                }
            ]
        });
        return {
            rows,
            count,
            pagination: {
                page,
                pageSize,
                totalPages: Math.ceil(count / pageSize)
            }
        };
    }

    async getPaymentById(userId, paymentId) {
        const payment = await Payment.findByPk(paymentId, {
            include: [
                {
                    model: ShortUrl,
                    as: "shortUrl",
                    attributes: ["id", "shortCode", "originalUrl"]
                }
            ]
        });

        if (!payment) throw new NotFoundError("Payment record not found.");

        if (payment.userId !== userId) {
            throw new ForbiddenError("You do not have permission to view this payment.");
        }

        return payment.toJSON();
    }
}

module.exports = PaymentService;
