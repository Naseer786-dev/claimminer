import { pgTable, serial, varchar, text, timestamp, integer, boolean, jsonb, real } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  company: varchar("company", { length: 255 }),
  role: varchar("role", { length: 50 }).default("contractor"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const rfps = pgTable("rfps", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  agency: varchar("agency", { length: 255 }).notNull(),
  agencyLevel: varchar("agency_level", { length: 50 }).notNull(),
  state: varchar("state", { length: 50 }),
  description: text("description"),
  value: varchar("value", { length: 100 }),
  dueDate: timestamp("due_date"),
  naics: varchar("naics", { length: 50 }),
  status: varchar("status", { length: 50 }).default("open"),
  matchScore: real("match_score").default(0),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  keywords: jsonb("keywords").$type<string[]>(),
  naicsCodes: jsonb("naics_codes").$type<string[]>(),
  agencyLevel: varchar("agency_level", { length: 50 }),
  states: jsonb("states").$type<string[]>(),
  minValue: varchar("min_value", { length: 100 }),
  maxValue: varchar("max_value", { length: 100 }),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  rfpId: integer("rfp_id").references(() => rfps.id),
  createdAt: timestamp("created_at").defaultNow(),
})

export const trackedRfps = pgTable("tracked_rfps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  rfpId: integer("rfp_id").references(() => rfps.id),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).default("tracking"),
  createdAt: timestamp("created_at").defaultNow(),
})
