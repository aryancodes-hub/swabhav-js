const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const loadRoutes = require("./configs/route-config.js");
const notFound = require("./middleware/not-found.js");
const errorHandler = require("./middleware/error-handler.js");
const app = express();
app.use(helmet());
app.use(cors());
app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    })
);
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Express API & ngrok tunnel are live and connected!",
        tunnelUrl: `${req.protocol}://${req.get("host")}`,
        endpoints: {
            webhook: "POST /api/v1/payments/webhook"
        },
        tip: "Opening this root URL in Chrome confirms ngrok forwarding is working. To test webhooks, send POST requests with valid 'x-razorpay-signature' headers via Postman or scripts."
    });
});
loadRoutes(app);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
