const { Model, DataTypes } = require("sequelize");
class SystemConfig extends Model {
    static initModel(sequelize) {
        SystemConfig.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true
                },
                key: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },
                value: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                dataType: {
                    type: DataTypes.ENUM("NUMBER", "STRING", "BOOLEAN", "JSON"),
                    defaultValue: "STRING",
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: "SystemConfig",
                tableName: "system_configs",
                timestamps: true,
                underscored: true,
                paranoid: false
            }
        );
        return SystemConfig;
    }

    static associate(models) {}

    getTypedValue() {
        switch (this.dataType) {
            case "NUMBER":
                return Number(this.value);
            case "BOOLEAN":
                return this.value === "true" || this.value === "1";
            case "JSON":
                return JSON.parse(this.value);
            default:
                return this.value;
        }
    }

    static async getValue(key, fallback = null) {
    const config = await SystemConfig.findOne({ where: { key } });
    return config ? config.getTypedValue() : fallback;
  }
}

module.exports = SystemConfig;
