require("dotenv").config({ path: ".env" });
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ Conexão com o Banco de Dados não está definida");
}

export const sql = neon(process.env.DATABASE_URL);
