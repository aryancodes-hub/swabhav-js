import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("error", (error)=>{
    console.log("Unexpected postgresql error", error);
});

export const db = drizzle(pool);

export const closeDbConnection = async () => {
    await pool.end();
}