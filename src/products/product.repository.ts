import { Database, QueryExecutor } from "../database/postgres";
import { ProductRow, ListProductQuery } from "./product.types";
import { Product } from "./product";

export interface IProductRepository {
    search(input: ListProductQuery): Promise<Product[]>;
    create(product: Product): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findByIds(ids: string[], client?: QueryExecutor): Promise<Product[]>;
    remove(id: string): Promise<boolean>;
    update(product: Product): Promise<Product | null>;
    existsBySku(sku: string): Promise<boolean>;
    findBySku(sku: string): Promise<Product | null>;
}

export class ProductRepository implements IProductRepository{
    constructor(
        private readonly db: Database
    ) {}

    private toDomain(row: ProductRow): Product {
        return new Product(
            row.id,
            row.name,
            Number(row.price),
            row.sku,
            row.active,
            row.description ?? null
        );
    }

    async search(input: ListProductQuery): Promise<Product[]> {
        const { name, minPrice, maxPrice, page, limit } = input;

        const conditions: string[] = ["active = true"];
        const values: Array<string | number | null> = [];

        if (name) {
            values.push(`%${name}%`);
            conditions.push(`name ILIKE $${values.length}`);
        }

        if (minPrice !== undefined) {
            values.push(minPrice);
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice !== undefined) {
            values.push(maxPrice);
            conditions.push(`price <= $${values.length}`);
        }

        const whereClause = `WHERE ${conditions.join(" AND ")}`;

        const offset = (page - 1) * limit;
        values.push(limit);

        const limitIndex = values.length;
        values.push(offset);

        const offsetIndex = values.length;

        const query = `
            SELECT
                id,
                name,
                price,
                description,
                sku
            FROM products
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;

        const products = await this.db.query<ProductRow>(query, values);

        return products.rows.map(row => this.toDomain(row))
    }

    async create(product: Product): Promise<Product> {
        const result = await this.db.query<ProductRow>(
            `
            INSERT INTO products (
                id,
                name,
                price,
                sku,
                description,
                active
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, price, sku, description, active
            `,
            [
                product.id,
                product.name,
                product.price,
                product.sku,
                product.description ?? null,
                product.active
            ]
        );

        return this.toDomain(result.rows[0]);
    }

    async findById(id: string): Promise<Product | null> {
        const result = await this.db.query<ProductRow>(
            `
            SELECT *
            FROM products
            WHERE id = $1
            AND active = true
            LIMIT 1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }

    async findByIds(ids: string[], client?: QueryExecutor): Promise<Product[]> {
        if (ids.length === 0) {
            return [];
        }

        const executor = client ?? this.db;

        const result = await executor.query<ProductRow>(
            `
            SELECT *
            FROM products
            WHERE id = ANY($1)
            AND active = true
            `,
            [ids]
        );

        return result.rows.map(row => this.toDomain(row));
    }

    async existsBySku(sku: string): Promise<boolean> {
        const result = await this.db.query(
            `
            SELECT 1
            FROM products
            WHERE sku = $1
            AND active = true
            LIMIT 1
            `,
            [sku]
        );

        return result.rows.length > 0;
    }

    async findBySku(sku: string): Promise<Product | null> {
        const result = await this.db.query<ProductRow>(
            `
            SELECT *
            FROM products
            WHERE sku = $1
            AND active = true
            LIMIT 1
            `,
            [sku]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.db.query(
            `
            UPDATE products
            SET
                active = false,
                updated_at = NOW()
            WHERE id = $1
            AND active = true
            `,
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }

    async update(product: Product): Promise<Product | null> {
        const result = await this.db.query(
            `
            UPDATE products
            SET
                name = $1,
                description = $2,
                price = $3,
                updated_at = NOW()
            WHERE id = $4
            AND active = true
            RETURNING *
            `,
            [
            product.name,
            product.description,
            product.price,
            product.id,
            ]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }
}