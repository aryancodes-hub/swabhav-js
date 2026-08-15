const express =  require("express");
const helmet = require("helmet");
const cors =  require("cors");
const loadRoutes = require("./configs/route-config.js");
const notFound = require("./middleware/not-found.js");
const errorHandler = require("./middleware/error-handler.js");
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
loadRoutes(app);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
