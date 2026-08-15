"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("password_reset_tokens", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            token_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            used_at: {
                type: Sequelize.DATE,
                allowNull: true
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
        await queryInterface.addIndex("password_reset_tokens", ["user_id"]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("password_reset_tokens");
    }
};
