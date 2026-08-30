import { treaty } from "@elysiajs/eden";
import type { App } from "@turborepo-starter-project/server";

export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");