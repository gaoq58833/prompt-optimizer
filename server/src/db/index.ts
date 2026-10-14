import path from 'path';
import fs from 'fs';
import type { Database } from 'better-sqlite3';

// serverless 环境（veFaaS/Vercel）中 /tmp 是唯一可写目录；本地开发默认 data 目录
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'app.sqlite');

let dbInstance: Database | null = null;
let dbUnavailable = false;

function ensureDb(): Database | null {
  if (dbInstance || dbUnavailable) {
    return dbInstance;
  }
  try {
    // 懒加载原生模块，避免在无原生扩展的 serverless 环境加载失败导致服务崩溃
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DatabaseCtor = require('better-sqlite3');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const instance = new DatabaseCtor(DB_PATH);
    instance.pragma('journal_mode = WAL');
    dbInstance = instance;
    return instance;
  } catch (err) {
    dbUnavailable = true;
    console.error('[db] 数据库不可用，已禁用提示词保存功能:', err);
    return null;
  }
}

/** 获取数据库连接；不可用时抛出异常 */
export function getDb(): Database {
  const db = ensureDb();
  if (!db) {
    throw new Error('数据库不可用');
  }
  return db;
}

/** 初始化数据库表结构（数据库不可用时静默跳过） */
export function initDb(): void {
  const db = ensureDb();
  if (!db) {
    return;
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
}
