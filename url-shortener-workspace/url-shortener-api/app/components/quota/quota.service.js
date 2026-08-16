const { User, Payment, SystemConfig } = require("@url/url-shortener-data-model");
const { NotFoundError, BadRequestError } = require("../../lib/error");
const PaymentGateway = require("../../utils/payment-gateway");

class QuotaService {
    async purchaseQuota(userId, { slots }) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        const pricePerSlot = await SystemConfig.getValue("ADDITIONAL_SLOT_PRICE", 20);
        const totalAmount = slots * pricePerSlot;
        const paymentMode = process.env.PAYMENT_MODE || "DUMMY";

        if (paymentMode === "DUMMY") {
            const paymentResult = await PaymentGateway.processDummyPayment(totalAmount);

            if (paymentResult.status !== "SUCCESS") {
                throw new BadRequestError("Payment processing failed.");
            }

            const sequelize = User.sequelize;
            return await sequelize.transaction(async (t) => {
                const payment = await Payment.create(
                    {
                        userId,
                        shortUrlId: null,
                        type: "QUOTA_PURCHASE",
                        amount: totalAmount,
                        slotsPurchased: slots,
                        status: paymentResult.status,
                        transactionId: paymentResult.transactionId,
                        completedAt: new Date()
                    },
                    { transaction: t }
                );

                user.purchasedQuota += slots;
                await user.save({ transaction: t });

                return {
                    mode: "DUMMY",
                    purchasedQuota: user.purchasedQuota,
                    payment: payment.toJSON()
                };
            });
        }

        const razorpayOrder = await PaymentGateway.createRazorpayOrder({
            amount: totalAmount,
            receipt: `quota_${userId}_${Date.now()}`
        });

        const payment = await Payment.create({
            userId,
            shortUrlId: null,
            type: "QUOTA_PURCHASE",
            amount: totalAmount,
            slotsPurchased: slots,
            providerOrderId: razorpayOrder.orderId,
            status: "PENDING"
        });

        return {
            mode: "RAZORPAY",
            paymentId: payment.id,
            razorpayOrder
        };
    }

    async verifyRazorQuota(
        userId,
        { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
    ) {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) throw new NotFoundError("Payment record not found.");
        if (payment.userId !== userId) {
            throw new BadRequestError("Unauthorized payment verification attempt.");
        }
        if (payment.status === "SUCCESS") {
            throw new BadRequestError("Payment has already been fulfilled.");
        }
        const isValid = PaymentGateway.verifyRazorpaySignature({
            orderId: razorpayOrderId,
            paymentId: razorpayOrderId,
            signature: razorpaySignature
        });
        if (!isValid) {
            ((payment.status = "FAILED"), await payment.save());
            throw new BadRequestError("Invalid payment signature.");
        }

        const sequelize = User.sequelize;
        return await sequelize.transaction(async (t) => {
            const user = await User.findByPk(userId, { transaction: t });
            user.purchasedQuota += payment.slotsPurchased;
            await user.save({ transaction: t });

            payment.status = "SUCCESS";
            payment.transactionId = razorpayPaymentId;
            payment.completedAt = new Date();
            await payment.save({ transaction: t });

            return {
                purchasedQuota: user.purchasedQuota,
                payment: payment.toJSON()
            };
        });
    }
}
module.exports = QuotaService;
