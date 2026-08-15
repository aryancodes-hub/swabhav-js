const path = require("path");
require("dotenv").config({path: path.resolve(__dirname,"../../../.env")});

const config = {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT || 5432),
    dialect: "postgres",
    logging: false
}
module.exports ={ development: config, production: config, testing: config}