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

module.exports = { purchaseQuotaSchema };