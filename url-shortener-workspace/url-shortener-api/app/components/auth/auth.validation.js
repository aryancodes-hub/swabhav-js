const { z } = require("zod");

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be atleast 2 characters long."),
        email: z.email("Invalid email format."),
        password: z.string().min(8, "Password must be atleast 8 character long.")
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email format."),
        password: z.string().min(1, "Password is required.")
    })
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email("Inavlid email format.")
    })
});

const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Reset token is required."),
        newPassword: z.string().min(8, "New password must be at least 8 characters long.")
    })
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};
