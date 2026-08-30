import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    basePath: "/auth",
    plugins: [
        adminClient(),
        passkeyClient(),
    ],
})