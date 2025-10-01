import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const quotesTable = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  address: text("address").notNull(),
});
