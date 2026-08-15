const { z } = require("zod");

// Basic phone number validation pattern
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long.").optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
    phone: z.string().regex(phoneRegex, "Invalid phone number format.").optional().nullable()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters long.")
  })
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema
};