CREATE TYPE "public"."card_brand" AS ENUM('visa', 'mastercard', 'amex', 'elo', 'hipercard', 'discover', 'other');--> statement-breakpoint
CREATE TYPE "public"."card_status" AS ENUM('active', 'blocked', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."history_type" AS ENUM('payment', 'deposit', 'withdrawal', 'fee', 'interest', 'adjustment');--> statement-breakpoint
ALTER TYPE "public"."debt_status" ADD VALUE 'renegotiated' BEFORE 'overdue';--> statement-breakpoint
CREATE TABLE "credit_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"last4" text NOT NULL,
	"brand" "card_brand" NOT NULL,
	"limit" numeric(14, 2) NOT NULL,
	"available_limit" numeric(14, 2) NOT NULL,
	"due_day" smallint NOT NULL,
	"status" "card_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "history_type" NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"debt_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "debts" RENAME COLUMN "amount" TO "original_amount";--> statement-breakpoint
ALTER TABLE "debts" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "debts" ADD COLUMN "current_amount" numeric(14, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "debts" ADD COLUMN "interest_rate" numeric(6, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "balance" numeric(14, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_cards" ADD CONSTRAINT "credit_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_debt_id_debts_id_fk" FOREIGN KEY ("debt_id") REFERENCES "public"."debts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_credit_cards_user_id" ON "credit_cards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_credit_cards_status" ON "credit_cards" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_history_user_id" ON "history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_history_type" ON "history" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_history_occurred_at" ON "history" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "idx_history_debt_id" ON "history" USING btree ("debt_id");--> statement-breakpoint
CREATE INDEX "idx_debts_user_id" ON "debts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_debts_status" ON "debts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_debts_due_date" ON "debts" USING btree ("due_date");