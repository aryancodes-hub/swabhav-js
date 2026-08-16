const { Op } = require("sequelize");
const { User, ShortUrl, Payment, SystemConfig } = require("@url/url-shortener-data-model");
const { NotFoundError, ConflictError, UnprocessableEntityError } = require("../../lib/error");

class AdminService {
    async listUsers(query, pagination) {
        const { status, role, search } = query;
        const { limit, offset, page, pageSize } = pagination;
        const where = {};
        if (status) where.status = status;
        if (role) where.role = role;
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }
        const { rows, count } = await User.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });
        return {
            rows: rows.map((u) => u.toJSON()),
            count,
            pagination: { page, pageSize, totalPages: Math.ceil(count / pageSize) }
        };
    }

    async getUserDetails(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new NotFoundError("User not found.");
        const freeQuota = await SystemConfig.getValue("FREE_URL_QUOTA", 5);
        const activeUrlCount = await ShortUrl.count({ where: { userId } });
        const totalQuota = freeQuota + user.purchasedQuota;
        const remainingQuota = Math.max(0, totalQuota - activeUrlCount);

        return {
            user: user.toJSON(),
            usageSummary: {
                activeUrlCount,
                totalQuota,
                remainingQuota
            }
        };
    }

    async blockUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new NotFoundError("User not found.");
        if (user.status === "BLOCKED") {
            throw new ConflictError("User account is already blocked.");
        }
        user.status = "BLOCKED";
        await user.save();
        return user.toJSON();
    }

    async unblockUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new NotFoundError("User not found.");
        if (user.status === "ACTIVE") {
            throw new ConflictError("User account is already active.");
        }

        user.status = "ACTIVE";
        await user.save();
        return user.toJSON();
    }

    async deleteUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new NotFoundError("User not found.");

        const sequelize = User.sequelize;
        await sequelize.transaction(async (t) => {
            // Cascading soft-delete associated URLs
            await ShortUrl.destroy({ where: { userId }, transaction: t });
            await user.destroy({ transaction: t });
        });
    }

    async restoreUser(userId) {
        const user = await User.findByPk(userId, { paranoid: false });
        if (!user) throw new NotFoundError("User not found.");

        const sequelize = User.sequelize;
        await sequelize.transaction(async (t) => {
            await user.restore({ transaction: t });
            // Restore associated URLs that were cascading soft-deleted
            await ShortUrl.restore({ where: { userId }, transaction: t });
        });

        return user.toJSON();
    }

    // URL GOVERNANCE

    async listUrls(query, pagination) {
        const { userId, status, includeDeleted } = query;
        const { limit, offset, page, pageSize } = pagination;

        const where = {};
        if (userId) where.userId = userId;
        if (status) where.status = status;

        const paranoid = includeDeleted !== "true";

        const { rows, count } = await ShortUrl.findAndCountAll({
            where,
            limit,
            offset,
            paranoid,
            order: [["createdAt", "DESC"]],
            include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }]
        });

        return {
            rows: rows.map((u) => u.toJSON()),
            count,
            pagination: { page, pageSize, totalPages: Math.ceil(count / pageSize) }
        };
    }

    async getUrlDetails(urlId) {
        const url = await ShortUrl.findByPk(urlId, {
            paranoid: false,
            include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }]
        });
        if (!url) throw new NotFoundError("URL record not found.");
        return url.toJSON();
    }

    async deleteUrl(urlId) {
        const url = await ShortUrl.findByPk(urlId);
        if (!url) throw new NotFoundError("URL record not found.");
        await url.destroy();
    }

    async restoreUrl(urlId) {
        const url = await ShortUrl.findByPk(urlId, { paranoid: false });
        if (!url) throw new NotFoundError("URL record not found.");
        await url.restore();
        return url.toJSON();
    }

    // --- PAYMENT GOVERNANCE ---

    async listPayments(query, pagination) {
        const { status, type, userId } = query;
        const { limit, offset, page, pageSize } = pagination;

        const where = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (userId) where.userId = userId;

        const { rows, count } = await Payment.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                { model: User, as: "user", attributes: ["id", "name", "email"] },
                { model: ShortUrl, as: "shortUrl", attributes: ["id", "shortCode"] }
            ]
        });

        return {
            rows: rows.map((p) => p.toJSON()),
            count,
            pagination: { page, pageSize, totalPages: Math.ceil(count / pageSize) }
        };
    }

    async getPaymentDetails(paymentId) {
        const payment = await Payment.findByPk(paymentId, {
            include: [
                { model: User, as: "user", attributes: ["id", "name", "email"] },
                { model: ShortUrl, as: "shortUrl", attributes: ["id", "shortCode"] }
            ]
        });
        if (!payment) throw new NotFoundError("Payment record not found.");
        return payment.toJSON();
    }

    // --- SYSTEM CONFIGURATION ---

    async getSystemConfigs() {
        const configs = await SystemConfig.findAll();
        const configMap = {};
        configs.forEach((c) => {
            configMap[c.key] = c.getTypedValue();
        });
        return configMap;
    }

    async updateSystemConfig(key, rawValue) {
        const config = await SystemConfig.findOne({ where: { key } });
        if (!config) throw new NotFoundError(`System configuration key '${key}' not found.`);

        let stringifiedValue = String(rawValue);

        // Data type validation check
        if (config.dataType === "NUMBER") {
            if (isNaN(Number(rawValue))) {
                throw new UnprocessableEntityError(
                    `Configuration '${key}' expects a numeric value.`
                );
            }
        } else if (config.dataType === "BOOLEAN") {
            if (
                typeof rawValue !== "boolean" &&
                !["true", "false", "1", "0"].includes(String(rawValue))
            ) {
                throw new UnprocessableEntityError(
                    `Configuration '${key}' expects a boolean value.`
                );
            }
        } else if (config.dataType === "JSON") {
            try {
                if (typeof rawValue === "object") {
                    stringifiedValue = JSON.stringify(rawValue);
                } else {
                    JSON.parse(rawValue);
                }
            } catch (err) {
                throw new UnprocessableEntityError(
                    `Configuration '${key}' expects a valid JSON string.`
                );
            }
        }

        config.value = stringifiedValue;
        await config.save();

        return {
            key: config.key,
            value: config.getTypedValue(),
            dataType: config.dataType
        };
    }
}

module.exports = AdminService;
