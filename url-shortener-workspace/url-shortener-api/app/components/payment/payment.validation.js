const { z } = require("zod");

const listPaymentQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
        pageSize: z.string().optional(),
        status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
        type: z.enum(["RENEWAL", "QUOTA_PURCHASE"]).optional()
    })
});

const paymentParamsSchema = z.object({
  params: z.object({
    paymentId: z.string().uuid("paymentId must be a valid UUID.")
  })
});

module.exports = {
  listPaymentQuerySchema,
  paymentParamsSchema
};