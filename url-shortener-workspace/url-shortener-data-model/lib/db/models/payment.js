const { Model, DataTypes } = require("sequelize");
class Payment extends Model {
    static initModel(sequelize) {
        Payment.init(
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
                shortUrlId: {
                    type: DataTypes.UUID,
                    allowNull: true
                },
                type: {
                    type: DataTypes.ENUM("RENEWAL", "QUOTA_PURCHASE"),
                    allowNull: false
                },
                amount: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false
                },
                slotsPurchased: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                },
                providerOrderId:{
                    type: DataTypes.STRING,
                    allowNull: true
                },
                transactionId:{
                    type: DataTypes.STRING,
                    allowNull: true
                },
                status: {
                    type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
                    defaultValue: "PENDING",
                    allowNull: false
                },
                completedAt: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName:"Payment",
                tableName:"payments",
                timestamps: true,
                underscored: true,
                paranoid:false
            }
        );
        return Payment
    }
    static associate(models){
        Payment.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user"
        });
        Payment.belongsTo(models.ShortUrl, {
            foreignKey: "shortUrlId",
            as: "shortUrl"
        });
    }
}

module.exports= Payment;
