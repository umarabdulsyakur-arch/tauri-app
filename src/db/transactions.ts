import { getDatabase } from "./database";
import type { Transaction, TransactionType } from "../types";

export interface TransactionFilters {
  type?: TransactionType | null;
  accountId?: number | null;
  search?: string;
}

/** Baris transaksi dengan nama akun/kategori hasil JOIN untuk tampilan. */
export interface TransactionRow extends Transaction {
  account_name: string;
  to_account_name: string | null;
  category_name: string | null;
  category_color: string | null;
  category_icon: string | null;
}

export interface TransactionInput {
  date: string;
  type: TransactionType;
  amount: number;
  account_id: number;
  to_account_id: number | null;
  category_id: number | null;
  tags: string;
  note: string;
  attachment_path: string | null;
}

export interface TransferInput {
  date: string;
  amount: number;
  from_account_id: number;
  to_account_id: number;
  fee: number;
  note: string;
}

export async function listTransactions(
  filters: TransactionFilters = {},
): Promise<TransactionRow[]> {
  const db = getDatabase();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.type) {
    conditions.push("t.type = $1");
    params.push(filters.type);
  }
  if (filters.accountId != null) {
    const i = params.length + 1;
    conditions.push(`(t.account_id = $${i} OR t.to_account_id = $${i})`);
    params.push(filters.accountId);
  }
  if (filters.search) {
    const i = params.length + 1;
    conditions.push(
      `(t.note LIKE $${i} OR t.tags LIKE $${i} OR c.name LIKE $${i} OR a.name LIKE $${i})`,
    );
    params.push(`%${filters.search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sql = `
    SELECT t.*,
           a.name  AS account_name,
           a2.name AS to_account_name,
           c.name  AS category_name,
           c.color AS category_color,
           c.icon  AS category_icon
    FROM transactions t
    LEFT JOIN accounts   a  ON a.id  = t.account_id
    LEFT JOIN accounts   a2 ON a2.id = t.to_account_id
    LEFT JOIN categories c  ON c.id  = t.category_id
    ${where}
    ORDER BY t.date DESC, t.id DESC
    LIMIT 500
  `;

  return db.select<TransactionRow[]>(sql, params);
}

export async function createTransaction(input: TransactionInput): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `INSERT INTO transactions
       (date, type, amount, account_id, to_account_id, category_id, tags, note, attachment_path)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      input.date,
      input.type,
      input.amount,
      input.account_id,
      input.to_account_id,
      input.category_id,
      input.tags,
      input.note,
      input.attachment_path,
    ],
  );
}

export async function updateTransaction(
  id: number,
  input: TransactionInput,
): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `UPDATE transactions
     SET date = $1, type = $2, amount = $3, account_id = $4,
         to_account_id = $5, category_id = $6, tags = $7, note = $8,
         attachment_path = $9
     WHERE id = $10`,
    [
      input.date,
      input.type,
      input.amount,
      input.account_id,
      input.to_account_id,
      input.category_id,
      input.tags,
      input.note,
      input.attachment_path,
      id,
    ],
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = getDatabase();
  await db.execute("DELETE FROM transactions WHERE id = $1", [id]);
}

/**
 * Membuat transfer antar-akun. Biaya admin (jika ada) dicatat sebagai
 * transaksi pengeluaran terpisah pada akun asal.
 */
export async function createTransfer(input: TransferInput): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `INSERT INTO transactions (date, type, amount, account_id, to_account_id, note)
     VALUES ($1, 'transfer', $2, $3, $4, $5)`,
    [input.date, input.amount, input.from_account_id, input.to_account_id, input.note],
  );

  if (input.fee > 0) {
    await db.execute(
      `INSERT INTO transactions (date, type, amount, account_id, note)
       VALUES ($1, 'expense', $2, $3, $4)`,
      [input.date, input.fee, input.from_account_id, "Biaya admin transfer"],
    );
  }
}
