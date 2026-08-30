import { sql } from "drizzle-orm";
import {
  pgTable,
  pgPolicy,
  index,
  text,
  timestamp,
  boolean,
  check,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// TODO: ADD ROLE TO TEACHER and STUDENT

export enum SubmitType {
  FileUpload,
  TextInput,
  OnPaper,
  NoSubmission
}

export const classroom = pgTable("classroom", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
  teacher_id: text("teacher_id").primaryKey().references(() => user.id, { "onDelete": "cascade" }).notNull(),
  members: text("members").array().references(() => user.id, { "onDelete": "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("classroom_teacher_id_idx").on(table.teacher_id),
  pgPolicy("classroom_teacher_owns_row", {
    for: "all",
    to: "authenticated",
    using: sql`${table.teacher_id} = auth.uid()`,
    withCheck: sql`${table.teacher_id} = auth.uid()`,
  }),
]);

export const event = pgTable("event", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
  class_id: text("class_id").references(() => classroom.id, { "onDelete": "cascade" }).notNull(),
  author_id: text("author_id").references(() => user.id, { "onDelete": "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  starts_at: timestamp("starts_at").notNull(),
  ends_at: timestamp("ends_at").notNull(),
  location: text("location"),
  recurrence_rule: text("recurrence_rule"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  endsAfterStarts: check("event_ends_after_starts", sql`${table.ends_at} > ${table.starts_at}`),
  classIdIdx: index("event_class_id_idx").on(table.class_id),
  authorIdIdx: index("event_author_id_idx").on(table.author_id),
  classroomTeacherCanManage: pgPolicy("event_teacher_can_manage", {
    for: "all",
    to: "authenticated",
    using: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
    withCheck: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
  }),
}));

export const assignment = pgTable("assignment", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
  class_id: text("class_id").references(() => classroom.id, { "onDelete": "cascade" }).notNull(),
  author_id: text("author_id").references(() => user.id, { "onDelete": "cascade" }).notNull(),
  name: text("title").notNull(),
  submit_type: text("submit_type").$type<SubmitType>().notNull(),
  due_at: timestamp("due_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("assignment_class_id_idx").on(table.class_id),
  index("assignment_author_id_idx").on(table.author_id),
  pgPolicy("assignment_teacher_can_manage", {
    for: "all",
    to: "authenticated",
    using: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
    withCheck: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
  }),
]);

export const announcement = pgTable("announcement", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()).notNull(),
  class_id: text("class_id").references(() => classroom.id, { "onDelete": "cascade" }).notNull(),
  author_id: text("author_id").references(() => user.id, { "onDelete": "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  pinned: boolean("pinned").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("announcement_class_id_idx").on(table.class_id),
  index("announcement_author_id_idx").on(table.author_id),
  pgPolicy("announcement_teacher_can_manage", {
    for: "all",
    to: "authenticated",
    using: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
    withCheck: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
  }),
]);

// Unlogged Table
export const join_codes = pgTable("join_codes", {
  join_code: text("join_code").unique().notNull(),
  class_id: text("class_id").references(() => classroom.id, { "onDelete": "cascade" }).notNull(),
  expires_at: timestamp("expires_at").notNull(),
}, (table) => [
  index("join_codes_class_id_idx").on(table.class_id),
  index("join_codes_expires_at_idx").on(table.expires_at),
  pgPolicy("join_codes_public_read", {
    for: "select",
    to: "public",
    using: sql`true`,
  }),
  pgPolicy("join_codes_teacher_can_generate_for_own_class", {
    for: "all",
    to: "authenticated",
    using: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
    withCheck: sql`EXISTS (
      SELECT 1
      FROM classroom c
      WHERE c.id = ${table.class_id}
        AND c.teacher_id = auth.uid()
    )`,
  }),
]);

// NOTE: Will have a pg_cron schedule to clean up expired join codes

export * from "./auth";