const {z, parseAsync} = require("zod");

const shortCodePattern = /^[a-zA-Z0-9_-]+$/;

const redirectSchema = z.object({
    params: z.object({
        shortCode: z.string().regex(shortCodePattern, "Invalid short code format.")
    })
});

const createUrlSchema = z.object({
    body: z.object({
        originalUrl: z.string().url("Must be a valid URL.").refine((val)=> val.startsWith("http://") || val.startsWith("https://"),
      "URL must use http or https protocol."),
      customAlias: z.string().min(3).max(30).regex(shortCodePattern, "Alias can only contain letters, numbers, underscores, and hyphens.").optional().nullable()
    })
});

const listUrlQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    status: z.enum(["ACTIVE", "EXPIRED"]).optional(),
    shortCode: z.string().optional(),
    sortBy: z.enum(["createdAt", "totalVisits"]).optional(),
    sortOrder: z.enum(["ASC", "DESC", "asc", "desc"]).optional()
  })
});

const urlParamsSchema = z.object({
  params: z.object({
    urlId: z.string().uuid("urlId must be a valid UUID.")
  })
});

const updateUrlSchema = z.object({
  params: z.object({
    urlId: z.string().uuid("urlId must be a valid UUID.")
  }),
  body: z.object({
    originalUrl: z.string().url("Must be a valid URL.").refine(
      (val) => val.startsWith("http://") || val.startsWith("https://"),
      "URL must use http or https protocol."
    )
  })
});

module.exports = {
  redirectSchema,
  createUrlSchema,
  listUrlQuerySchema,
  urlParamsSchema,
  updateUrlSchema
};