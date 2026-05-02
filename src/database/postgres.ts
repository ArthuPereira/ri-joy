import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg"

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export class Database {
    private pool?: Pool;

    constructor(private readonly config: DatabaseConfig) {}

    private getPool(): Pool {
        if (!this.pool) {
            this.pool = new Pool({
                host: this.config.host,
                port: this.config.port,
                user: this.config.user,
                password: this.config.password,
                database: this.config.database
            });
        }

        return this.pool;
    }

    async query<T extends QueryResultRow = any>(
        sql: string,
        params?: any[]
    ): Promise<QueryResult<T>> {
        return this.getPool().query<T>(sql, params);
    }

    async getClient(): Promise<PoolClient> {
        return this.getPool().connect();
    }

    async close(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
        }
    }
}