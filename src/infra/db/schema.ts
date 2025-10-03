import { relations } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const riskBandEnum = pgEnum("risk_band", ["A", "B", "C"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const quotesTable = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    address: text("address").notNull(),
    monthlyConsumptionKwh: numeric("monthly_consumption_kwh").notNull(),
    systemSizeKw: numeric("system_size_kw").notNull(),
    downPayment: numeric("down_payment"),

    systemPrice: numeric("system_price").notNull(),
    riskBand: riskBandEnum("risk_band").notNull(),
  },
  (table) => [
    index("quotes_user_id_idx").on(table.userId),
    index("quotes_created_at_idx").on(table.createdAt),
  ]
);

export const quotesRelations = relations(quotesTable, ({ many, one }) => ({
  offers: many(offersTable),
  user: one(usersTable, {
    fields: [quotesTable.userId],
    references: [usersTable.id],
  }),
}));

export const offersTable = pgTable(
  "offers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteId: uuid("quote_id")
      .notNull()
      .references(() => quotesTable.id, { onDelete: "cascade" }),
    termYears: integer("term_years").notNull(),
    apr: numeric("apr").notNull(),
    principalUsed: numeric("principal_used").notNull(),
    monthlyPayment: numeric("monthly_payment").notNull(),
  },
  (table) => [index("offers_quote_id_idx").on(table.quoteId)]
);

export const offersRelations = relations(offersTable, ({ one }) => ({
  quote: one(quotesTable, {
    fields: [offersTable.quoteId],
    references: [quotesTable.id],
  }),
}));
