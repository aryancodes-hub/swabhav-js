import "dotenv/config"
import express from "express"
import studentRoutes from "./routes/student.routes.js"

const app = express();
app.use(express.json());

app.get("/health", (req,res)=>{
    res.status(200).json({
        message: "App is running"
    })
});
app.use("/api/students", studentRoutes)

export default app;
