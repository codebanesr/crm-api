import { format, transports, LoggerOptions, createLogger } from "winston";

const consoleOpts = {
    handleExceptions: true,
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: format.combine(
        format.json(),
        format.colorize({ all: true }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.padLevels()
    )
}

const options: LoggerOptions = {
    transports: [
        new transports.Console(consoleOpts),
        new transports.File({ filename: "debug.log", level: "debug" })
    ],
    format: format.combine(
        // format.json(),
        format.timestamp()
    )
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;