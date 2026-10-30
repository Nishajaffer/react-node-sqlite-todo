import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import path from "node:path";

const databasePath = fileURLToPath(new URL("./todos.db", import.meta.url));
const db = new Database(databasePath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
