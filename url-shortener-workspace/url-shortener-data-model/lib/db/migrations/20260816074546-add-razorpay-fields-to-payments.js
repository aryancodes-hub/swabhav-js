'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add provider_order_id column
    await queryInterface.addColumn('payments', 'provider_order_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add transaction_id column
    await queryInterface.addColumn('payments', 'transaction_id', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Modify slots_purchased to allow null values for RENEWAL records
    await queryInterface.changeColumn('payments', 'slots_purchased', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('payments', 'provider_order_id');
    await queryInterface.removeColumn('payments', 'transaction_id');
    await queryInterface.changeColumn('payments', 'slots_purchased', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};