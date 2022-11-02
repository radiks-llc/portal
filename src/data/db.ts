import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("radiks.db");

export const getUserByEmail = (email: string) => {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
};

export const getVotes = (postID: string) =>
  db.prepare(`SELECT email, option FROM votes WHERE post_id = ?`).all(postID);

export const increaseVotes = (
  postID: string,
  email: string,
  option: number
) => {
  db.prepare(
    `INSERT INTO votes (email, post_id, option) VALUES (?, ?, ?) ON CONFLICT(email, post_id) DO UPDATE SET option = ?`
  ).run(email, postID, option, option);
};

export const ensureSchema = () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (datetime('now', 'localtime'))
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL,
        post_id TEXT NOT NULL,
        option INTEGER NOT NULL,
        voted_at DATETIME NOT NULL DEFAULT (datetime('now', 'localtime')),
        UNIQUE(post_id, email)
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS invites (
        id TEXT PRIMARY KEY,
        fromID INTEGER NOT NULL REFERENCES users(id),
        toID INTEGER DEFAULT NULL REFERENCES users(id),
        created_at DATETIME NOT NULL DEFAULT (datetime('now', 'localtime'))
    )`
  ).run();

  const password = import.meta.env.MITCH_PASS;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  db.prepare(
    "INSERT OR IGNORE INTO users (email, password, is_admin) VALUES (?, ?, ?)"
  ).run("me@mitchellhynes.com", hash, 1);
};

ensureSchema();
