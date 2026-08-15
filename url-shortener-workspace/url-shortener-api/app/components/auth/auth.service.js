const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { op } = require("sequelize");
const { User, PasswordResetToken } = require("@url/url-shortener-data-model");
const {
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    BadRequestError
} = require("../../lib/error.js");

class AuthService {
    async register({ name, email, password }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictError("Email is already registered.");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            passwordHash,
            role: "USER",
            status: "ACTIVE",
            purchasedQuota: 0
        });

        const userData = user.toJSON(); 
        delete userData.passwordHash; 
        return userData;
    }

    async login({ email, password }) {
        const user = await User.scope("withPassword").findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw new UnauthorizedError("Invalid credentials");
        }

        if (user.status === "BLOCKED") {
            throw new ForbiddenError("Your account has been blocked by an administrator.");
        }

        const token = this.generateToken(user);
        const userData = user.toJSON(); 
        delete userData.passwordHash; 
        return {
            token,
            userData
        };
    }

    generateToken(user) {
        return jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "dev-secret",
            { expiresIn: process.env.JWT_EXPIRY || "1d" }
        );
    }

    async forgotPassword({ email }) {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const rawToken = crypto.randomBytes(32).toString("hex");
            const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await PasswordResetToken.create({
                userId: user.id,
                tokenHash,
                expiresAt
            });
            console.log(`\n[DEBUG RESET LINK TOKEN] For ${email}: ${rawToken}\n`);
        }
        return {
            message:
                "If an account with that email exists, password reset instructions have been sent."
        };
    }

    async resetPassword({ token, newPassword }) {
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const resetTokenRecord = await PasswordResetToken.findOne({
            where: {
                tokenHash,
                usedAt: null,
                expiresAt: { [op.gt]: new Date() }
            }
        });
        if (!resetTokenRecord) {
            throw new BadRequestError("Invalid or expired password reset token.");
        }
        const newPasswordHash = bcrypt.hash(newPassword, 10);

        const user = await User.findByPk(resetTokenRecord.userId);
        if (!user) {
            throw new BadRequestError("User associated with this token no longer exists.");
        }

        user.passwordHash = newPasswordHash;
        await user.save();

        resetTokenRecord.usedAt = new Date();
        await resetTokenRecord.save();

        return { message: "Password has been reset successfully." };
    }
}

module.exports = AuthService;
