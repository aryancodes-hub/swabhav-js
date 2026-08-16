const { z } = require("zod");

const adminListUsersQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
        pageSize: z.string().optional(),
        status: z.enum(["PENDING_VERIFICATION", "ACTIVE", "BLOCKED"]).optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
        search: z.string().optional()
    })
});

const adminUserParamsSchema = z.object({
    params: z.object({
        userId: z.uuid("userId must be a valid UUID.")
    })
});

const adminListUrlsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
    pageSize: z.string().optional(),
    userId: z.uuid().optional(),
    status: z.enum(["ACTIVE", "EXPIRED"]).optional(),
    includeDeleted: z.string().optional()
    })
})

const adminUrlParamsSchema = z.object({
    params: z.object({
        urlId: z.uuid("userId must be a valid UUID.")
    })
});

const adminListPaymentsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional(),
    pageSize: z.string().optional(),
    status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
    type: z.enum(["RENEWAL", "QUOTA_PURCHASE"]).optional(),
    userId: z.uuid().optional()
    })
});

const adminPaymentParamsSchema = z.object({
    params: z.object({
        paymentId: z.uuid("userId must be a valid UUID.")
    })
});

const updateConfigSchema = z.object({
  params: z.object({
    key: z.string().min(1, "Config key is required.")
  }),
  body: z.object({
    value: z.any({ required_error: "Value is required." })
  })
});

module.exports = {
  adminListUsersQuerySchema,
  adminUserParamsSchema,
  adminListUrlsQuerySchema,
  adminUrlParamsSchema,
  adminListPaymentsQuerySchema,
  adminPaymentParamsSchema,
  updateConfigSchema
};