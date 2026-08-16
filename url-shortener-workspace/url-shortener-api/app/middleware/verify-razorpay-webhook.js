const crypto = require("crypto");
const { BadRequestError, UnauthorizedError } = require("../lib/error");

module.exports = (req, res, next) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (process.env.PAYMENT_MODE === "DUMMY" && !webhookSecret) {
        return next();
    }
    if (!webhookSecret) {
        return next(
            new BadRequestError("RAZORPAY_WEBHOOK_SECRET is not configured on the server.")
        );
    }
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
        return next(new UnauthorizedError("Missing 'x-razorpay-signature' header."));
    }
    const rawPayload = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawPayload)
        .digest("hex");

    if (expectedSignature !== signature) {
        return next(new UnauthorizedError("Invalid webhook signature."));
    }

    next();
};
