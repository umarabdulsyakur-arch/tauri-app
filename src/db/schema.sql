PRAGMA foreign_keys = ON;

-- Akun / Dompet (Tunai, Bank, E-Wallet, Kartu Kredit)
CREATE TABLE IF NOT EXISTS accounts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    type            TEXT    NOT NULL CHECK (type IN ('cash', 'bank', 'ewallet', 'credit')),
    initial_balance REAL    NOT NULL DEFAULT 0,
    current_balance REAL    NOT NULL DEFAULT 0,
    color           TEXT    NOT NULL DEFAULT '#3B82F6',
    icon            TEXT    NOT NULL DEFAULT 'wallet',
    is_archived     INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Kategori (bertigkat: parent_id untuk subkategori)
CREATE TABLE IF NOT EXISTS categories (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER REFERENCES categories (id) ON DELETE CASCADE,
    name      TEXT    NOT NULL,
    type      TEXT    NOT NULL CHECK (type IN ('income', 'expense')),
    color     TEXT    NOT NULL DEFAULT '#6B7280',
    icon      TEXT    NOT NULL DEFAULT 'tag'
);

-- Transaksi
CREATE TABLE IF NOT EXISTS transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    date            TEXT    NOT NULL,
    type            TEXT    NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'adjustment')),
    amount          REAL    NOT NULL,
    account_id      INTEGER NOT NULL REFERENCES accounts (id),
    to_account_id   INTEGER REFERENCES accounts (id),
    category_id     INTEGER REFERENCES categories (id),
    tags            TEXT    NOT NULL DEFAULT '[]',
    note            TEXT    NOT NULL DEFAULT '',
    attachment_path TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Aturan transaksi berulang
CREATE TABLE IF NOT EXISTS recurring_rules (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT    NOT NULL,
    type          TEXT    NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount        REAL    NOT NULL,
    account_id    INTEGER NOT NULL REFERENCES accounts (id),
    category_id   INTEGER REFERENCES categories (id),
    frequency     TEXT    NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    next_due_date TEXT    NOT NULL,
    is_active     INTEGER NOT NULL DEFAULT 1
);

-- Anggaran bulanan per kategori
CREATE TABLE IF NOT EXISTS budgets (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id  INTEGER NOT NULL REFERENCES categories (id),
    month_year   TEXT    NOT NULL,
    limit_amount REAL    NOT NULL,
    UNIQUE (category_id, month_year)
);

-- Utang / Piutang
CREATE TABLE IF NOT EXISTS debts (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    person_name      TEXT    NOT NULL,
    type             TEXT    NOT NULL CHECK (type IN ('payable', 'receivable')),
    total_amount     REAL    NOT NULL,
    remaining_amount REAL    NOT NULL,
    due_date         TEXT,
    note             TEXT    NOT NULL DEFAULT '',
    status           TEXT    NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid'))
);

-- Pengaturan aplikasi (key-value)
CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_date     ON transactions (date);
CREATE INDEX IF NOT EXISTS idx_transactions_account  ON transactions (account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month         ON budgets (month_year);

-- Trigger: sinkronkan saldo akun secara atomik setiap transaksi ditambahkan.
CREATE TRIGGER IF NOT EXISTS trg_transactions_insert
AFTER INSERT ON transactions
BEGIN
    UPDATE accounts
    SET current_balance = current_balance + CASE
        WHEN NEW.type = 'income'     THEN NEW.amount
        WHEN NEW.type = 'expense'    THEN -NEW.amount
        WHEN NEW.type = 'transfer'   THEN -NEW.amount
        WHEN NEW.type = 'adjustment' THEN NEW.amount
        ELSE 0
    END
    WHERE id = NEW.account_id;

    UPDATE accounts
    SET current_balance = current_balance + NEW.amount
    WHERE NEW.type = 'transfer' AND id = NEW.to_account_id;
END;

-- Trigger: balikkan efek transaksi saat transaksi dihapus.
CREATE TRIGGER IF NOT EXISTS trg_transactions_delete
AFTER DELETE ON transactions
BEGIN
    UPDATE accounts
    SET current_balance = current_balance - CASE
        WHEN OLD.type = 'income'     THEN OLD.amount
        WHEN OLD.type = 'expense'    THEN -OLD.amount
        WHEN OLD.type = 'transfer'   THEN -OLD.amount
        WHEN OLD.type = 'adjustment' THEN OLD.amount
        ELSE 0
    END
    WHERE id = OLD.account_id;

    UPDATE accounts
    SET current_balance = current_balance - OLD.amount
    WHERE OLD.type = 'transfer' AND id = OLD.to_account_id;
END;

-- Trigger: sesuaikan saldo saat transaksi diubah (balikkan lama, terapkan baru).
CREATE TRIGGER IF NOT EXISTS trg_transactions_update
AFTER UPDATE ON transactions
BEGIN
    UPDATE accounts
    SET current_balance = current_balance - CASE
        WHEN OLD.type = 'income'     THEN OLD.amount
        WHEN OLD.type = 'expense'    THEN -OLD.amount
        WHEN OLD.type = 'transfer'   THEN -OLD.amount
        WHEN OLD.type = 'adjustment' THEN OLD.amount
        ELSE 0
    END
    WHERE id = OLD.account_id;

    UPDATE accounts
    SET current_balance = current_balance - OLD.amount
    WHERE OLD.type = 'transfer' AND id = OLD.to_account_id;

    UPDATE accounts
    SET current_balance = current_balance + CASE
        WHEN NEW.type = 'income'     THEN NEW.amount
        WHEN NEW.type = 'expense'    THEN -NEW.amount
        WHEN NEW.type = 'transfer'   THEN -NEW.amount
        WHEN NEW.type = 'adjustment' THEN NEW.amount
        ELSE 0
    END
    WHERE id = NEW.account_id;

    UPDATE accounts
    SET current_balance = current_balance + NEW.amount
    WHERE NEW.type = 'transfer' AND id = NEW.to_account_id;
END;
