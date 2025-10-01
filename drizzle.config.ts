import { defineConfig } from "drizzle-kit";
import { databaseUrl } from "@/infra/db/config";

export default defineConfig({
  out: "./src/infra/db/migrations",
  schema: "./src/infra/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl!,
  },
});
