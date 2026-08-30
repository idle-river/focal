import { auth } from "../lib/auth";
import { Elysia } from "elysia";
import { z } from "zod";

const app = new Elysia()
  .mount("/auth", auth.handler)
  .listen(3000);

export type App = typeof app;

export const GET = app.get;
export const POST = app.post;
export const PUT = app.put;
export const DELETE = app.delete;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);