"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM("USER", "ADMIN"),
                defaultValue: "USER",
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("PENDING_VERIFICATION", "ACTIVE", "BLOCKED"),
                defaultValue: "PENDING_VERIFICATION",
                allowNull: false
            },
            purchased_quota: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            avatar_url: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
        await queryInterface.addIndex('users', ['email'], { unique: true });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
