const { z } = require("zod");

const purchaseQuotaSchema = z.object({
    body: z.object({
        slots: z
            .number({ invalid_type_error: "Slots must be a number." })
            .int("Slots must be an integer.")
            .min(1, "Must purchase at least 1 slot.")
            .max(100, "Cannot purchase more than 100 slots per transaction.")
    })
});

const verifyPaymentSchema = z.object({
    body: z.object({
        paymentId: z.string().uuid("paymentId must be a valid UUID."),
        razorpayOrderId: z.string().min(1, "razorpayOrderId is required."),
        razorpayPaymentId: z.string().min(1, "razorpayPaymentId is required."),
        razorpaySignature: z.string().min(1, "razorpaySignature is required.")
    })
});

module.exports = { purchaseQuotaSchema, verifyPaymentSchema };
