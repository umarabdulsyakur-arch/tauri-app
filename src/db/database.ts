import Database from "@tauri-apps/plugin-sql";
import schemaSql from "./schema.sql?raw";
import seedSql from "./seed.sql?raw";

let db: Database | null = null;

/**
 * Memecah teks SQL menjadi array pernyataan tunggal (dipisahkan tanda `;`).
 * Cukup andal untuk skema/seed di proyek ini karena tidak ada titik-koma
 * di dalam literal string.
 */
function splitStatements(sql: string): string[] {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

async function executeStatements(database: Database, sql: string): Promise<void> {
  for (const statement of splitStatements(sql)) {
    await database.execute(statement);
  }
}

/**
 * Menginisialisasi database SQLite: membuat skema (idempoten via IF NOT EXISTS)
 * dan mengisi data awal hanya ketika database masih kosong.
 */
export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  const database = await Database.load("sqlite:app.db");

  await executeStatements(database, schemaSql);

  // Seed hanya dijalankan pada database yang masih kosong (belum ada akun).
  const accounts = await database.select<{ count: number }[]>(
    "SELECT COUNT(*) AS count FROM accounts",
  );
  const accountCount = accounts[0]?.count ?? 0;

  if (accountCount === 0) {
    await executeStatements(database, seedSql);
  }

  db = database;
  return db;
}

/**
 * Mengembalikan koneksi database yang sudah terinisialisasi.
 * Melempar error jika `initDatabase()` belum dipanggil.
 */
export function getDatabase(): Database {
  if (!db) {
    throw new Error("Database belum diinisialisasi. Panggil initDatabase() terlebih dahulu.");
  }
  return db;
}
