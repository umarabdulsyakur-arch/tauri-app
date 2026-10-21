import type { AccountType, Frequency, TransactionType } from "../types";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Tunai",
  bank: "Bank",
  ewallet: "E-Wallet",
  credit: "Kartu Kredit",
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  cash: "banknote",
  bank: "landmark",
  ewallet: "smartphone",
  credit: "credit-card",
};

export const ACCOUNT_TYPE_ORDER: AccountType[] = [
  "cash",
  "bank",
  "ewallet",
  "credit",
];

export const PRESET_COLORS = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#F97316",
  "#84CC16",
  "#06B6D4",
  "#6B7280",
];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  income: "Pemasukan",
  expense: "Pengeluaran",
  transfer: "Transfer",
  adjustment: "Penyesuaian",
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
};

export const FREQUENCY_ORDER: Frequency[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];
