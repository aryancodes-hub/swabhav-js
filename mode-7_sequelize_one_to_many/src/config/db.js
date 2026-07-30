import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
        logging: process.env.SQL_LOGGING == true? console.log :false
    }
)

export const connectDB = async () => {
    await sequelize.authenticate();
    console.log("Authenticated and connected successfully");
}

export const synchronizeDB = async () => {
    await sequelize.sync();
    console.log("Database table synchronized successfully.");
}

export default sequelize;