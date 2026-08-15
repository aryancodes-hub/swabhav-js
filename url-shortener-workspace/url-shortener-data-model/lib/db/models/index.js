const { Sequelize } = require("sequelize");
const configs = require("../../config/database.js");
const sequelize = new Sequelize( configs[process.env.NODE_ENV || "development"] || configs.development);
const User = require("./user.js").initModel(sequelize);
const ShortUrl = require("./short-url.js").initModel(sequelize);
const PasswordResetToken = require("./password-reset-token.js").initModel(sequelize);
const Payment = require("./payment.js").initModel(sequelize);
const SystemConfig = require("./system-config.js").initModel(sequelize);
const models = {
    User,
    ShortUrl,
    PasswordResetToken,
    Payment,
    SystemConfig
};
Object.values(models).forEach((model)=> model.associate(models))
module.exports = { sequelize, Sequelize, ...models };