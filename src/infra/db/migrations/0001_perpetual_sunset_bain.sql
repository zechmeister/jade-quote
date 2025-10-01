CREATE TYPE "public"."risk_band" AS ENUM('A', 'B', 'C');--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_id" uuid NOT NULL,
	"term_years" integer NOT NULL,
	"apr" numeric NOT NULL,
	"principal_used" numeric NOT NULL,
	"monthly_payment" numeric NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "full_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "monthly_consumption_kwh" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "system_size_kw" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "down_payment" numeric;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "system_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "risk_band" "risk_band" NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "offers_quote_id_idx" ON "offers" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "quotes_user_id_idx" ON "quotes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");