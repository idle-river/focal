import "dotenv/config";

const isBun = typeof Bun !== "undefined";

export const db = await (async () => {
    if (isBun) {
        const { SQL } = await import("bun");
        const { drizzle } = await import("drizzle-orm/bun-sql");
        return drizzle(new SQL(process.env.DATABASE_URL!));
    } else {
        const { default: postgres } = await import("postgres");
        const { drizzle } = await import("drizzle-orm/postgres-js");
        return drizzle(postgres(process.env.DATABASE_URL!));
    }
})();

export * from "./schema";