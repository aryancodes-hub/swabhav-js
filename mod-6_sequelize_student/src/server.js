import "dotenv/config";
import app from "./app.js";
import { connectDatabase, synchronizeDatabase } from "./config/db.js";

const PORT = Number(process.env.PORT ?? 3000);

const startServer = async ()=>{
    try {
        connectDatabase();
        synchronizeDatabase();

        app.listen(PORT, ()=>{
            console.log(`app is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(
            "Application failed to start:",
            error.message
        );

        process.exit(1);
    }
}

await startServer();
