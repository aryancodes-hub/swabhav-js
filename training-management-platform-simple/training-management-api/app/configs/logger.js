const { createLogger, format, transports } = require("winston");
const isProduction = process.env.NODE_ENV = "production";
const seralizedNestedError = format((info)=>{
    if(info.error instanceof Error){
        info.error = {
            name: info.error.name,
            message: info.error.message,
            stack: info.error.stack
        };
    }
    return info
});

const logger = createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    format: format.combine(
        format.timestamp(),
        format.errors({stack: true}),
        seralizedNestedError(),
        isProduction? format.json(): format.combine(format.colorize(), format.simple())
    ),
    defaultMeta: {
        application: "training-management-api-simple"
    },
    transports:[new transports.Console()]
})
