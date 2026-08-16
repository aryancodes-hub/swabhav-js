const { Payment, ShortUrl, User, SystemConfig } = require("@url/url-shortener-data-model");
const { NotFoundError, ForbiddenError } = require("../../lib/error.js");

class PaymentService {
    async getUserPayments(userId, query, pagination) {
        const { status, type } = query;
        const { limit, offset, page, pageSize } = pagination;
        const where = { userId };
        if (status) where.status = status;
        if (type) where.type = type;

        const { rows, count } = await Payment.findAndCountAll({
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

    async processWebhookEvent(eventPayload) {
        const { event, payload } = eventPayload;
        if (event === "payment.captured" || event === "order.paid") {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const paymentId = paymentEntity.payment_id;

            const payment = await Payment.findOne({
                where: { providerOrderId: orderId }
            });

            if (!payment) {
                console.warn(`[WEBHOOK WARNING] No pending payment found for order: ${orderId}`);
                return { status: "IGNORED", reason: "Order not found" };
            }
            if (payment.status === "SUCCESS") {
                return { status: "SKIPPED", reason: "Payment already fulfilled" };
            }
            const sequelize = Payment.sequelize;
            return await sequelize.transaction(async(t)=>{
                if(payment.type === "QUOTA_PURCHASE"){
                    const user = await User.findByPk(payment.userId, {transaction: t});
                    if(user){
                        user.purchasedQuota += payment.slotsPurchased;
                        await user.save({transaction: t});
                    }
                }
                if (payment.type === "RENEWAL" && payment.shortUrlId){
                    const shortUrl = await ShortUrl.findByPk(payment.shortUrlId, {transaction: t});
                    if(shortUrl){
                        const visitsPerRenewal = await SystemConfig.getValue("VISITS_PER_RENEWAL", 100);
                        shortUrl.remainigVisits += visitsPerRenewal;
                        shortUrl.status = "ACTIVE";
                        await shortUrl.save({transaction:t});
                    }
                }

                payment.status = "SUCCESS";
                payment.transactionId = paymentId;
                payment.completedAt = new Date();
                await payment.save({transaction:t});
                return{status: "SUCCESS", paymentId: payment.id};
            });
        }

        if(event === "payment.failed"){
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const payment = await Payment.findOne({
                where: { providerOrderId: orderId}
            });
            if(payment && payment.status === "PENDING"){
                payment.status = "FAILED";
                await payment.save();
            }
            return {status: "MARKED_FAILED"};
        }
        return {status: "IGNORED", reason: "Unhandled event type"}
    }
}

module.exports = PaymentService;
