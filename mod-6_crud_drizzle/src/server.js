import "dotenv/config";
import app from "./app.js"
// import { closeDatabaseConnection } from "./cofig/database";


const PORT = Number(process.env.PORT ?? 3000);

const server = app.listen(PORT, async (req,res) => {
    console.log(`Server is running on PORT ${PORT}`);
    
})