import DB from "better-sqlite3";
import bcrypt from "bcryptjs";

export const ensureSchema = (db: DB) => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (datetime('now', 'localtime'))
    )`
  ).run();

  const password = import.meta.env.MITCH_PASS;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.prepare(
    "INSERT OR IGNORE INTO users (email, password, is_admin) VALUES (?, ?, ?)"
  ).run("me@mitchellhynes.com", hash, 1);

  const users = db.prepare("SELECT * FROM users").get();
  console.log(users);
};
