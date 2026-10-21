export type AccountType = "cash" | "bank" | "ewallet" | "credit";
export type TransactionType = "income" | "expense" | "transfer" | "adjustment";
export type CategoryType = "income" | "expense";

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  initial_balance: number;
  current_balance: number;
  color: string;
  icon: string;
  is_archived: number;
  created_at: string;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  amount: number;
  account_id: number;
  to_account_id: number | null;
  category_id: number | null;
  tags: string;
  note: string;
  attachment_path: string | null;
  created_at: string;
}

export type Frequency = "daily" | "weekly" | "monthly" | "yearly";
export type RecurringType = "income" | "expense";

export interface RecurringRule {
  id: number;
  title: string;
  type: RecurringType;
  amount: number;
  account_id: number;
  category_id: number | null;
  frequency: Frequency;
  next_due_date: string;
  is_active: number;
}
