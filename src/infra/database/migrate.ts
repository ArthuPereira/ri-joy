import fs from "fs";
import path from "path";
import { Database } from "./postgres";

const db = new Database();

async function alreadyRun(id: string) {
  const result = await db.query(
    `SELECT 1 FROM migrations WHERE id = $1`,
    [id]
  );

  return result.rowCount! > 0;
}

async function markAsRun(id: string) {
  await db.query(
    `INSERT INTO migrations (id) VALUES ($1)`,
    [id]
  );
}

export async function runMigrations() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const pathMigrations = path.join("src", "infra", "migrations");
  const files = fs.readdirSync(pathMigrations).sort();

  for (const file of files) {
    if (await alreadyRun(file)) continue;

    const sql = fs.readFileSync(
      path.join(pathMigrations, file),
      "utf-8"
    );

    await db.query(sql);
    await markAsRun(file);

    console.log(`arquivo migrado com sucesso: ${file}`);
  }
}

await runMigrations();
console.log("Migrations concluídas com sucesso");

db.close();