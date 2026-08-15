import express from "express";
import router from "./routes/student.routes.js";
import deptRouter from "./routes/dept.routes.js";
import courseRouter from "./routes/course.route.js";
import enrollRouter from "./routes/enrollment.route.js";
// import handleNotFound from "./middleware/handleNotFound.js";

const app = express();

app.use(express.json());

app.get("/health", (req,res) => {
    return res.status(200).json({
            success: true,
            message:
                "Sequelize one-to-one application is running"
        });
})

app.use("/api/students", router)
app.use("/api/depts", deptRouter)
app.use("/api/courses", courseRouter)
app.use("/api/enrollments", enrollRouter)


app.use((req, res) => {
        return res.status(404).json({
            success: false,
            message:
                `Route ${req.method} ${req.originalUrl} not found`
        });
    });

export default app;