"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("system_configs", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            key: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            value: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            data_type: {
                type: Sequelize.ENUM("NUMBER", "STRING", "BOOLEAN", "JSON"),
                defaultValue: "STRING",
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
        await queryInterface.addIndex("system_configs", ["key"], { unique: true });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("system_configs");
    }
};
