import { getDatabase } from "./database";
import type { Category } from "../types";

export async function listCategories(): Promise<Category[]> {
  const db = getDatabase();
  return db.select<Category[]>(
    "SELECT * FROM categories ORDER BY type ASC, id ASC",
  );
}
