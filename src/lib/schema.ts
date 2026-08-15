import { pgTable, uuid, text, timestamp, decimal, boolean, date, pgEnum } from "drizzle-orm/pg-core";

export const rfpStatusEnum = pgEnum("rfp_status", ["open", "closing_soon", "closed"]);
export const alertTypeEnum = pgEnum("alert_type", ["email", "sms", "webhook"]);
export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "starter", "pro", "enterprise"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  companyName: text("company_name"),
  naicsCodes: text("naics_codes").array(),
  capabilities: text("capabilities").array(),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rfps = pgTable("rfps", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: text("source_id").notNull().unique(),
  title: text("title").notNull(),
  agency: text("agency").notNull(),
  agencyLevel: text("agency_level").notNull(), // federal, state, local
  state: text("state"),
  naicsCodes: text("naics_codes").array(),
  description: text("description"),
  estimatedValue: decimal("estimated_value", { precision: 14, scale: 2 }),
  postedDate: date("posted_date"),
  responseDeadline: date("response_deadline"),
  status: rfpStatusEnum("status").default("open"),
  sourceUrl: text("source_url"),
  solicitationNumber: text("solicitation_number"),
  setAside: text("set_aside"), // small business, woman-owned, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  keywords: text("keywords").array(),
  naicsCodes: text("naics_codes").array(),
  agencyLevel: text("agency_level"), // federal, state, local, all
  states: text("states").array(),
  minValue: decimal("min_value", { precision: 14, scale: 2 }),
  maxValue: decimal("max_value", { precision: 14, scale: 2 }),
  setAsideTypes: text("set_aside_types").array(),
  isActive: boolean("is_active").default(true),
  notifyEmail: boolean("notify_email").default(true),
  notifyDaily: boolean("notify_daily").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  alertId: uuid("alert_id").notNull().references(() => alerts.id),
  rfpId: uuid("rfp_id").notNull().references(() => rfps.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }),
  isRead: boolean("is_read").default(false),
  isSaved: boolean("is_saved").default(false),
  isDismissed: boolean("is_dismissed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trackedRfps = pgTable("tracked_rfps", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  rfpId: uuid("rfp_id").notNull().references(() => rfps.id),
  status: text("status").default("tracking"), // tracking, bidding, submitted, won, lost
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});
