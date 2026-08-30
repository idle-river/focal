import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, haveIBeenPwned } from "better-auth/plugins";
import * as schema from "../db/schema/auth";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { db } from "../db";

const rpID = process.env.BETTER_AUTH_URL?.replace(/^https?:\/\//, "") || "localhost";

const resolvedLogLevel = process.env.BETTER_AUTH_LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug");
const logLevel: "error" | "debug" | "info" | "warn" =
    resolvedLogLevel === "error" || resolvedLogLevel === "warn" || resolvedLogLevel === "info" || resolvedLogLevel === "debug"
        ? resolvedLogLevel
        : "info";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    advanced: {
        cookiePrefix: "turborepo-starter-project",
    },
    emailAndPassword: {
        enabled: true,
        maxPasswordLength: 128,
        minPasswordLength: 8,
    },
    logger: {
        level: logLevel,
    },
    session: {
        expiresIn: 60 * 60 * 24, // 1 day in seconds
    },
    plugins: [
        admin({
            bannedUserMessage: "Your account has been banned. Please contact support for more information.",
            impersonationSessionDuration: 60 * 60, // 1 hour in seconds
        }),
        haveIBeenPwned({
            customPasswordCompromisedMessage: "This password has been compromised in a data breach. Please choose a different password.",
        }),
        passkey({
            rpName: "Turborepo Starter Project",
            rpID,
            authenticatorSelection: {
                residentKey: "required",
                userVerification: "required",
                authenticatorAttachment: "platform",
            },
            advanced: {
                webAuthnChallengeCookie: "turborepo-starter-project",
            }
        })
    ],
    basePath: "/auth",
});