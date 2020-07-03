"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const consoleOpts = {
    handleExceptions: true,
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: winston_1.format.combine(winston_1.format.json(), winston_1.format.colorize({ all: true }), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.padLevels())
};
const options = {
    transports: [
        new winston_1.transports.Console(consoleOpts),
        new winston_1.transports.File({ filename: "debug.log", level: "debug" })
    ],
    format: winston_1.format.combine(
    // format.json(),
    winston_1.format.timestamp())
};
const logger = winston_1.createLogger(options);
if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}
exports.default = logger;
//# sourceMappingURL=logger.js.map