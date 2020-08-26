import Redis from 'ioredis';
import { REDIS_URI } from "../util/secrets";
export class RedisContainer {
    private static client: Redis.Redis;
    public static initialize(): void {
        RedisContainer.client = new Redis({
            port: 6379,
            host: REDIS_URI,
        });
    }

    public static getClient(): Redis.Redis {
        return RedisContainer.client;
    }
}