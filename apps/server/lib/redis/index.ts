import { RedisClient } from "bun";

type RedisOptions = {
    url: string;
    options?: Bun.RedisOptions;
};

class Redis {
    private client: RedisClient;

    constructor(options: RedisOptions) {
        this.client = new RedisClient(options.url, options.options);
    }

    async set(key: string, value: string, expireInSeconds?: number) {
        if (expireInSeconds) {
            await this.client.set(key, value, "EX", expireInSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? (JSON.parse(value) as T) : null;
    }

    async del(key: string) {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return await this.client.exists(key);
    }
}

export const redis = new Redis({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});