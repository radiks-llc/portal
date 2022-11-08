import Database from "better-sqlite3";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);
const db = new Database("radiks.db");

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, salt);
};

export const createUser = (email, passHash, isAdmin = 0) => {
  const newUser = db
    .prepare(
      "INSERT INTO users (email, password, is_admin) VALUES (?, ?, ?) RETURNING id"
    )
    .get(email, passHash, isAdmin);

  db.prepare("UPDATE invitations SET to_id=? WHERE invitations.email=?").run(
    newUser.id,
    email
  );
};

export const getInvitation = (uuid: string | number) => {
  return db.prepare(`SELECT * FROM invitations WHERE id=?`).get(uuid);
};

export const getInvitations = (from_id: number) => {
  return db.prepare(`SELECT * FROM invitations WHERE from_id=?`).all(from_id);
};

export const inviteUserByEmail = (from_id: number, email: string) => {
  console.log(from_id, email);
  const response = db
    .prepare(`INSERT INTO invitations (id, from_id, email) VALUES (?, ?, ?)`)
    .run(crypto.randomUUID(), from_id, email);
  if (response === null) {
    throw new Error("User not found");
  }
  return response;
};

export const cancelInviteByEmail = (id: number, email: string) => {
  const response = db
    .prepare(`DELETE FROM invitations WHERE from_id=? AND email=? RETURNING *`)
    .run(id, email);
  if (response === null) {
    throw new Error("User not found");
  }
  return response;
};

export const countUsers = () => {
  return db.prepare("SELECT COUNT(*) as userCount FROM users").get().userCount;
};

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
    `CREATE TABLE IF NOT EXISTS invitations (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        from_id INTEGER NOT NULL REFERENCES users(id),
        to_id INTEGER DEFAULT NULL REFERENCES users(id),
        created_at DATETIME NOT NULL DEFAULT (datetime('now', 'localtime')),
        UNIQUE(from_id, email)
    )`
  ).run();

  const password = import.meta.env.MITCH_PASS;

  db.prepare(
    "INSERT OR IGNORE INTO users (email, password, is_admin) VALUES (?, ?, ?)"
  ).run("me@mitchellhynes.com", hashPassword(password), 1);
};

ensureSchema();
