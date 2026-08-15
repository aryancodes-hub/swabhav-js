const express = require("express");
const router = require("./routes/student.routes.js");
const deptRouter = require("./routes/dept.routes.js");
// const handleNotFound = require("./middleware/handleNotFound.js");

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

app.use((req, res) => {
        return res.status(404).json({
            success: false,
            message:
                `Route ${req.method} ${req.originalUrl} not found`
        });
    });

module.exports = app;