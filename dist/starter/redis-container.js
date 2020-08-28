"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisContainer = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const secrets_1 = require("../util/secrets");
class RedisContainer {
    static initialize() {
        RedisContainer.client = new ioredis_1.default({
            port: 6379,
            host: secrets_1.REDIS_URI,
        });
    }
    static getClient() {
        return RedisContainer.client;
    }
}
exports.RedisContainer = RedisContainer;
//# sourceMappingURL=redis-container.js.map