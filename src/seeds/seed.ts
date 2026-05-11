import { seedDb } from "./db";
import { seedS3 } from "./s3";
import { Database } from "../infra/database/postgres";

export const db = new Database();

async function run() {
  try {
    console.log("Seed do bucket S3...");
    await seedS3();

    console.log("Seed do banco de dados...");
    await seedDb();

    console.log("Seed concluído com sucesso :)");
  } catch (err) {
    console.error("Erro ao executar seed:", err);
    process.exit(1);
  } finally {
    db.close();
  }
}

await run();