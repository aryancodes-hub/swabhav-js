"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payments", {
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
            short_url_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: "short_urls",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            type: {
                type: Sequelize.ENUM("RENEWAL", "QUOTA_PURCHASE"),
                allowNull: false
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            slots_purchased: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM("PENDING", "SUCCESS", "FAILED"),
                defaultValue: "PENDING",
                allowNull: false
            },
            completed_at: {
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
        await queryInterface.addIndex("payments", ["user_id", "status"]);
        await queryInterface.addIndex("payments", ["short_url_id"]);
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("payments");
    }
};
