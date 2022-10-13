import DB from "better-sqlite3";

export const ensureSchema = (db: DB) => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (datetime('now', 'localtime'))
    )`
  ).run();
};
