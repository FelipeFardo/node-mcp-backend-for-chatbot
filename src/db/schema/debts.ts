import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users.ts"; // import da tabela de usuários

export const debtStatus = pgEnum("debt_status", ["pending", "paid", "overdue"]);

export const debts = pgTable("debts", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	description: text("description").notNull(),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(), // até 999.999.999.99
	dueDate: timestamp("due_date").notNull(),
	paidAt: timestamp("paid_at"), // null = não paga
	status: debtStatus("status").default("pending").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
