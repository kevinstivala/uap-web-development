import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private async init() {
    if (process.env.POPULATE_DB === "true") {
      await this.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY ,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
      await this.run(`
    CREATE TABLE IF NOT EXISTS boards (
      id TEXT PRIMARY KEY ,
      name TEXT NOT NULL,
      ownerId INTEGER NOT NULL,
      FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
      await this.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY ,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      boardId INTEGER NOT NULL,
      FOREIGN KEY(boardId) REFERENCES boards(id) ON DELETE CASCADE
    );
  `);
      await this.run(`
    CREATE TABLE IF NOT EXISTS board_users (
      userId TEXT NOT NULL,
      boardId TEXT NOT NULL,
      role TEXT NOT NULL, -- 'dueño' or 'editor', 'lector'
      PRIMARY KEY (userId, boardId),
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(boardId) REFERENCES boards(id) ON DELETE CASCADE
    );
  `);
      await this.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      userId TEXT NOT NULL PRIMARY KEY,
      refreshInterval INTEGER DEFAULT 10,
      upperCaseDescription BOOLEAN DEFAULT 0,
      paginationLimit INTEGER DEFAULT 5,
      viewMode TEXT DEFAULT 'list',
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
    }
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export const database = new Database();
