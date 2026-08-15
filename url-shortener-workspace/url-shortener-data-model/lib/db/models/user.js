const { Model, DataTypes } = require("sequelize");

class User extends Model {
    static initModel(sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    validate: {
                        len: [2, 100]
                    },
                    set(value) {
                        this.setDataValue('name', value.trim());
                    }
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true
                    },
                    set(value) {
                        this.setDataValue('email', value.trim().toLowerCase());
                    }
                },
                passwordHash: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                role: {
                    type: DataTypes.ENUM("USER", "ADMIN"),
                    allowNull: false,
                    defaultValue: "USER"
                },
                status: {
                    type: DataTypes.ENUM("PENDING_VERIFICATION", "ACTIVE", "BLOCKED"),
                    defaultValue: "PENDING_VERIFICATION",
                    allowNull: false
                },
                purchasedQuota: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                    validate: {
                        min: 0
                    }
                },
                bio: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                phone: {
                    type: DataTypes.STRING(15),
                    allowNull: true
                },
                avatarUrl: {
                    type: DataTypes.STRING(500),
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: "User",
                tableName: "users",
                underscored: true,
                timestamps: true,
                paranoid: true,
                defaultScope:{
                    attributes: {exclude:["passwordHash"]}
                },
                scopes:{
                    withPassword:{
                        attributes: {include:["passwordHash"]}
                    }
                }
            }
        );
        return User;
    }
    static associate(models) {
        (User.hasMany(models.PasswordResetToken, {
            foreignKey: "userId",
            as: "passwordResetTokens",
            onDelete: "CASCADE"
        }),
            User.hasMany(models.Payment, {
                foreignKey: "userId",
                as: "payments",
                onDelete: "RESTRICT"
            }),
            User.hasMany(models.ShortUrl, {
                foreignKey: "userId",
                as: "shortUrls",
                onDelete: "RESTRICT"
            }));
    }
    isActive() {
        return this.status === "ACTIVE";
    }

    isBlocked() {
        return this.status === "BLOCKED";
    }

    toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }
}

module.exports = User;
