import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Explicitly load .env from backend folder
dotenv.config({ path: path.resolve('./.env') });

// Debug
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Supabase URL or KEY is missing in .env");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
