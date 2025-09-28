import { Redis } from "@upstash/redis";

let redis: Redis;

export function getRedisClient() {
    if (!redis) {
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            throw new Error("❌ UPSTASH_REDIS env vars not defined");
        }
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return redis;
}
