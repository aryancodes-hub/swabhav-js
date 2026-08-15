"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("short_urls", {
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
                onDelete: "RESTRICT"
            },
            original_url: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            short_code: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            is_custom_alias: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "EXPIRED"),
                defaultValue: "ACTIVE",
                allowNull: false
            },
            max_visits: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            total_visits: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            remaining_visits: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            last_accessed_at: {
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
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
        await queryInterface.addIndex("short_urls", ["short_code"], { unique: true });
        await queryInterface.addIndex("short_urls", ["user_id", "status"]);
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("short_urls");
    }
};
