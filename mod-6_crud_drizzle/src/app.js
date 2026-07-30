import express from "express"
import router from "./routes/studentRoutes.js"
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get('/', async (req,res) => {
    res.status(200).json({message:"App is running"})    
})

app.use("/api/students", router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;