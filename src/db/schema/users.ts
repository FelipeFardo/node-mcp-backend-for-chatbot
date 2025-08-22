import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userStatus = pgEnum("user_status", ["active", "inactive"]);

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone"),
	emailVerified: timestamp("emailVerified"),
	passwordHash: text("password_hash"),
	status: userStatus("status").default("inactive").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
