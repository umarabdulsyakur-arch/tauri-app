import { getDatabase } from "./database";
import { advanceDate, todayISO } from "../lib/date";
import type { Frequency, RecurringRule, RecurringType } from "../types";

export interface RecurringInput {
  title: string;
  type: RecurringType;
  amount: number;
  account_id: number;
  category_id: number | null;
  frequency: Frequency;
  next_due_date: string;
}

export async function listRecurringRules(): Promise<RecurringRule[]> {
  const db = getDatabase();
  return db.select<RecurringRule[]>(
    "SELECT * FROM recurring_rules ORDER BY is_active DESC, next_due_date ASC",
  );
}

export async function createRecurring(input: RecurringInput): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `INSERT INTO recurring_rules
       (title, type, amount, account_id, category_id, frequency, next_due_date, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 1)`,
    [
      input.title,
      input.type,
      input.amount,
      input.account_id,
      input.category_id,
      input.frequency,
      input.next_due_date,
    ],
  );
}

export async function updateRecurring(
  id: number,
  input: RecurringInput,
): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `UPDATE recurring_rules
     SET title = $1, type = $2, amount = $3, account_id = $4,
         category_id = $5, frequency = $6, next_due_date = $7
     WHERE id = $8`,
    [
      input.title,
      input.type,
      input.amount,
      input.account_id,
      input.category_id,
      input.frequency,
      input.next_due_date,
      id,
    ],
  );
}

export async function setRecurringActive(
  id: number,
  active: boolean,
): Promise<void> {
  const db = getDatabase();
  await db.execute(
    "UPDATE recurring_rules SET is_active = $1 WHERE id = $2",
    [active ? 1 : 0, id],
  );
}

export async function deleteRecurring(id: number): Promise<void> {
  const db = getDatabase();
  await db.execute("DELETE FROM recurring_rules WHERE id = $1", [id]);
}

/**
 * Memproses aturan berulang yang jatuh tempo: membuat transaksi yang
 * terlewat (dengan batas aman) lalu memajukan `next_due_date`.
 * Mengembalikan jumlah transaksi yang berhasil dibuat.
 */
export async function processDueRecurring(): Promise<number> {
  const db = getDatabase();
  const today = todayISO();
  const rules = await db.select<RecurringRule[]>(
    "SELECT * FROM recurring_rules WHERE is_active = 1 AND next_due_date <= $1",
    [today],
  );

  let created = 0;
  const safetyCap = 100;

  for (const rule of rules) {
    let due = rule.next_due_date;
    while (due <= today && created < safetyCap) {
      await db.execute(
        `INSERT INTO transactions (date, type, amount, account_id, category_id, note)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [due, rule.type, rule.amount, rule.account_id, rule.category_id, rule.title],
      );
      created += 1;
      due = advanceDate(due, rule.frequency);
    }
    await db.execute(
      "UPDATE recurring_rules SET next_due_date = $1 WHERE id = $2",
      [due, rule.id],
    );
  }

  return created;
}
