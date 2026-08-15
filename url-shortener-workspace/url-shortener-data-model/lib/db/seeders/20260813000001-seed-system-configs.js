const crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const configs = [
      {
        id: crypto.randomUUID(),
        key: "FREE_URL_QUOTA",
        value: "5",
        data_type: "NUMBER",
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        key: "MAX_VISITS_PER_URL",
        value: "100",
        data_type: "NUMBER",
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        key: "URL_RENEWAL_PRICE",
        value: "50.00",
        data_type: "NUMBER",
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        key: "VISITS_PER_RENEWAL",
        value: "100",
        data_type: "NUMBER",
        created_at: now,
        updated_at: now
      },
      {
        id: crypto.randomUUID(),
        key: "ADDITIONAL_SLOT_PRICE",
        value: "20.00",
        data_type: "NUMBER",
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert("system_configs", configs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("system_configs", null, {});
  }
};