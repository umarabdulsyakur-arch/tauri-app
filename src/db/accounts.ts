import { getDatabase } from "./database";
import type { Account, AccountType } from "../types";

export interface AccountInput {
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string;
  icon: string;
}

/** Mengambil seluruh akun, yang aktif didahulukan. */
export async function listAccounts(): Promise<Account[]> {
  const db = getDatabase();
  return db.select<Account[]>(
    "SELECT * FROM accounts ORDER BY is_archived ASC, id ASC",
  );
}

export async function createAccount(input: AccountInput): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `INSERT INTO accounts (name, type, initial_balance, current_balance, color, icon)
     VALUES ($1, $2, $3, $3, $4, $5)`,
    [input.name, input.type, input.initial_balance, input.color, input.icon],
  );
}

export async function updateAccount(id: number, input: AccountInput): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `UPDATE accounts
     SET name = $1, type = $2, color = $3, icon = $4
     WHERE id = $5`,
    [input.name, input.type, input.color, input.icon, id],
  );
}

export async function setAccountArchived(
  id: number,
  archived: boolean,
): Promise<void> {
  const db = getDatabase();
  await db.execute(
    "UPDATE accounts SET is_archived = $1 WHERE id = $2",
    [archived ? 1 : 0, id],
  );
}

/**
 * Rekonsiliasi saldo: menghitung selisih antara saldo tercatat dan saldo
 * aktual, lalu membuat transaksi "adjustment" sebesar selisihnya.
 * Trigger `trg_transactions_insert` akan memperbarui `current_balance`
 * secara atomik sehingga tidak ada peluang saldo tidak konsisten.
 */
export async function reconcileAccount(
  accountId: number,
  actualBalance: number,
  note: string,
): Promise<void> {
  const db = getDatabase();
  const rows = await db.select<Account[]>(
    "SELECT * FROM accounts WHERE id = $1",
    [accountId],
  );
  const account = rows[0];
  if (!account) {
    throw new Error("Akun tidak ditemukan.");
  }

  const difference =
    Math.round((actualBalance - account.current_balance) * 100) / 100;
  if (difference === 0) {
    return;
  }

  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  await db.execute(
    `INSERT INTO transactions (date, type, amount, account_id, note)
     VALUES ($1, 'adjustment', $2, $3, $4)`,
    [date, difference, accountId, note],
  );
}
