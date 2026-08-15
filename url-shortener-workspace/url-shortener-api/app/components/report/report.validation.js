const { z } = require("zod");

const reportQuerySchema = z.object({
    query: z.object({
        startDate: z
            .string()
            .datetime({ offset: true })
            .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional(),
        endDate: z
            .string()
            .datetime({ offset: true })
            .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
            .optional()
    })
});

module.exports = { reportQuerySchema };
