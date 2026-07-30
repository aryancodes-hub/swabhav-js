import "dotenv/config";
import express from "express";
import router from "./routes/studentRoute.js";


const app = express();
app.use(express.json());
app.get("/",(req,res)=>{
    return res.status(200).json({
        message: "App is running"
    })
})
app.use("/api/students", router)

export default app;