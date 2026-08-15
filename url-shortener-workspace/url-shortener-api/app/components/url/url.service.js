const { Op } = require("sequelize");
const {
    ShortUrl,
    User,
    SystemConfig,
    Payment,
    DatabaseService
} = require("@url/url-shortener-data-model");
const {
    NotFoundError,
    ForbiddenError,
    ConflictError,
    GoneError,
    UnprocessableEntityError
} = require("../../lib/error");
const { generateShortCode } = require("../../utils/code-generator");
const PaymentGateway = require("../../utils/payment-gateway.js");

class UrlService {

    async redirect(shortCode) {
        // console.log(shortCode)
        const urlRecord = await ShortUrl.findOne({
            where: { shortCode },
            raw: false
        });

        if (!urlRecord) {
            throw new NotFoundError("Short URL not found.");
        }
        if (urlRecord.status === "EXPIRED" || urlRecord.remainingVisits <= 0) {
            throw new GoneError("This shortened link has expired or reached its visit limit.");
        }
        urlRecord.totalVisits += 1;
        urlRecord.remainingVisits -= 1;
        urlRecord.lastAccessedAt = new Date();

        if (urlRecord.remainingVisits === 0) {
            urlRecord.status = "EXPIRED";
        }
        await urlRecord.save();
        console.log(urlRecord.originalUrl);
        const url = urlRecord.originalUrl;
        return url;
    }

    async createUrl(userId, { originalUrl, customAlias }) {
        const user = await User.findByPk(userId);
        if (!user) throw new NotFoundError("User not found.");

        const freeQuota = await SystemConfig.getValue("FREE_URL_QUOTA", 5);
        const totalAllowedQuota = freeQuota + user.purchasedQuota;

        const activeUrlCount = await ShortUrl.count({ where: { userId } });
        if (activeUrlCount >= totalAllowedQuota) {
            throw new ConflictError(
                "URL creation quota exhausted. Please purchase additional quota."
            );
        }

        let finalCode = customAlias;
        let isCustom = false;

        if (customAlias) {
            const aliasExists = await ShortUrl.findOne({
                where: {  shortCode: customAlias },
                paranoid: false
            });
            if (aliasExists) {
                throw new ConflictError("Custom alias is already taken.");
            }
            isCustom = true;
        }

        const maxVisits = await SystemConfig.getValue("MAX_VISITS_PER_URL", 100);

        const MAX_RETRIES = 3;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                if (!isCustom) {
                    finalCode = generateShortCode(7);
                }

                const newUrl = await ShortUrl.create({
                    userId,
                    originalUrl,
                    shortCode: finalCode,
                    isCustomAlias: isCustom,
                    status: "ACTIVE",
                    maxVisits,
                    totalVisits: 0,
                    remainingVisits: maxVisits
                });

                return newUrl.toJSON();
            } catch (error) {
                if (
                    error.name === "SequelizeUniqueConstraintError" &&
                    !isCustom &&
                    attempt < MAX_RETRIES - 1
                ) {
                    continue;
                }
                throw error;
            }
        }
    }

    async getUserUrl(userId, query, pagination) {
        const { status, shortCode, sortBy = "createdAt", sortOrder = "DESC" } = query;
        const { limit, offset, page, pageSize } = pagination;
        const where = { userId };
        if (status) where.status = status;
        if (shortCode) where.shortCode = { [Op.iLike]: `%${shortCode}%` };
        const orderDirection = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
        const orderField = ["createdAt", "totalVisits"].includes(sortBy) ? sortBy : "createdAt";
        const { rows, count } = await ShortUrl.findAndCountAll({
            where,
            limit,
            offset,
            order: [[orderField, orderDirection]]
        });

        return {
            rows,
            count,
            pagination: {
                page,
                pageSize,
                totalPages: Math.ceil(count / pageSize)
            }
        };
    }

    async getUrlById(userId, urlId) {
        const urlRecord = await ShortUrl.findByPk(urlId);
        if (!urlRecord) throw new NotFoundError("URL record not found.");

        if (urlRecord.userId !== userId) {
            throw new ForbiddenError("You do not have permission to access this URL.");
        }
        return urlRecord.toJSON();
    }

    async updateUrl(userId, urlId, { originalUrl }) {
        const urlRecord = await ShortUrl.findByPk(urlId);
        if (!urlRecord) throw new NotFoundError("URL record not found.");

        if (urlRecord.userId !== userId) {
            throw new ForbiddenError("You do not have permission to update this URL.");
        }

        urlRecord.originalUrl = originalUrl;
        await urlRecord.save();

        return urlRecord.toJSON();
    }

    async deleteUrl(userId, urlId) {
        const urlRecord = await ShortUrl.findByPk(urlId);
        if (!urlRecord) throw new NotFoundError("URL record not found.");

        if (urlRecord.userId !== userId) {
            throw new ForbiddenError("You do not have permission to update this URL.");
        }
        await urlRecord.destroy();
    }

    async renewUrl(userId, urlId) {
        const urlRecord = await ShortUrl.findByPk(urlId);
        if (!urlRecord) throw new NotFoundError("URL record not found.");
        if (urlRecord.userId !== userId) {
            throw new ForbiddenError("You do not have permission to renew this URL.");
        }
        if (urlRecord.status !== "EXPIRED") {
            throw new ConflictError("Only EXPIRED URLs can be renewed.");
        }
        const renewalPrice = await SystemConfig.getValue("URL_RENEWAL_PRICE", 50);
        const visitsPerRenewal = await SystemConfig.getValue("VISITS_PER_RENEWAL", 100);

        const paymentResult = await PaymentGateway.processDummyPayment(renewalPrice);

        if (paymentResult.status !== "SUCCESS") {
            throw new BadRequestError("Payment processing failed.");
        }

        const sequelize = ShortUrl.sequelize;
        return await sequelize.transaction(async (t) => {
            const payment = await Payment.create(
                {
                    userId,
                    shortUrlId: urlRecord.id,
                    type: "RENEWAL",
                    amount: renewalPrice,
                    status: paymentResult.status,
                    completedAt: new Date()
                },
                { transaction: t }
            );

            urlRecord.remainingVisits += visitsPerRenewal;
            urlRecord.status = "ACTIVE";
            await urlRecord.save({ transaction: t });

            return {
                url: urlRecord.toJSON(),
                payment: payment.toJSON()
            };
        });
    }

}

module.exports = UrlService;
