const { Model, DataTypes } = require("sequelize");
class PasswordResetToken extends Model {
    static initModel(sequelize) {
        PasswordResetToken.init(
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
                tokenHash: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                expiresAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                usedAt: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: "PasswordResetToken",
                tableName: "password_reset_tokens",
                underscored: true,
                paranoid: false,
                timestamps: true
            }
        );
        return PasswordResetToken;
    }
    static associate(models) {
        PasswordResetToken.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user"
        });
    }
    isValid() {
        return !this.usedAt && new Date() < new Date(this.expiresAt);
    }
}

module.exports = PasswordResetToken;
