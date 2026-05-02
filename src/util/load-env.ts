import { DatabaseConfig } from '../database/postgres';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Varíavel de ambiente faltando: ${name}`);
  }
  return value;
}

export function loadDatabaseConfig(): DatabaseConfig {
    return {
        host: requireEnv('DB_HOST'),
        port: Number(requireEnv('DB_PORT')),
        user: requireEnv('DB_USER'),
        password: requireEnv('DB_PASSWORD'),
        database: requireEnv('DB_NAME'),
    };
}