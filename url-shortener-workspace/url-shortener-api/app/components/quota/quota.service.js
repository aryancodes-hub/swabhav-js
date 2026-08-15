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

        const paymentResult = await PaymentGateway.processDummyPayment(totalAmount);
        if (paymentResult.status !== "SUCCESS") {
            throw new BadRequestError("Payment processing failed.");
        }
        const sequelize = User.sequelize;
        return await sequelize.transaction(async (t)=>{
            const payment = await Payment.create({
                userId,
                shortUrlId: null,
                type: "QUOTA_PURCHASE",
                amount: totalAmount,
                slotsPurchased: slots,
                status: paymentResult.status,
                completedAt: new Date()
            },
            { transaction: t}
        );
        user.purchasedQuota += slots;
        await user.save({transaction: t});

        return{
            purchasedQuota: user.purchasedQuota,
            payment: payment.toJSON()
        };
        });
    }
}
module.exports = QuotaService;