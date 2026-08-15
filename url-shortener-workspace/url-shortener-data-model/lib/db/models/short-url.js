const { Model, DataTypes } = require("sequelize");
class ShortUrl extends Model {
    static initModel(sequelize) {
        ShortUrl.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false
                },
                originalUrl: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                shortCode: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },
                isCustomAlias: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                status: {
                    type: DataTypes.ENUM("ACTIVE", "EXPIRED"),
                    defaultValue: "ACTIVE",
                    allowNull: false
                },
                maxVisits: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                totalVisits: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                remainingVisits: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                lastAccessedAt: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: "ShortUrl",
                tableName: "short_urls",
                paranoid: true,
                underscored: true,
                timestamps: true
            }
        );
        return ShortUrl;
    }
    static associate(models) {
        ShortUrl.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user"
        });
        ShortUrl.hasMany(models.Payment, {
            foreignKey: "shortUrlId",
            as: "payments"
        });
    }
    isExpired() {
        return this.status === "EXPIRED" || this.remainingVisits <= 0;
    }
}

module.exports = ShortUrl;
