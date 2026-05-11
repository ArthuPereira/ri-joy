import { Database } from "../../infra/database/postgres";
import { ProductImage, ProductImageDB } from "../product.types";

export interface IProductImageRepository {
    create(productId: string, storageKey: string, contentType: string): Promise<ProductImageDB>;
    findByProductId(productId: string): Promise<ProductImageDB[]>;
    findByProductIds(productIds: string[]): Promise<ProductImage[]>;
    deleteById(id: string): Promise<void>;
    findById(imageId: string): Promise<ProductImageDB | null>;
}

export class ProductImageRepository implements IProductImageRepository {
    constructor(
            private readonly db: Database
    ) {}

    async create(productId: string, storageKey: string, contentType: string): Promise<ProductImageDB> {
        const { rows } = await this.db.query(
            `
            insert into product_images
                (product_id, storage_key, content_type)
            values
                ($1, $2, $3)
            returning
                id,
                product_id,
                storage_key,
                content_type,
                created_at
            `,
            [productId, storageKey, contentType]
        );

        const row = rows[0];

        return {
            id: row.id,
            productId: row.product_id,
            storageKey: row.storage_key,
            contentType: row.content_type,
            createdAt: row.created_at,
        };
    }

    async deleteById(id: string): Promise<void> {
        await this.db.query(
            `
            delete from product_images
            where id = $1
            `,
            [id]
        );
    }

    async findByProductId(productId: string): Promise<ProductImageDB[]> {
        const { rows } = await this.db.query(
            `
            SELECT
                id,
                product_id,
                storage_key,
                content_type,
                created_at
            FROM product_images
            WHERE product_id = $1
            ORDER BY created_at ASC
            `,
            [productId]
        );

        return rows.map((row) => ({
            id: row.id,
            productId: row.product_id,
            storageKey: row.storage_key,
            contentType: row.content_type,
            createdAt: row.created_at,
        }));
    }

    async findByProductIds(productIds: string[]): Promise<ProductImage[]> {
        if (productIds.length === 0) return [];

        const { rows } = await this.db.query(
            `
            SELECT
                id,
                product_id,
                storage_key,
                content_type,
                created_at
            FROM product_images
            WHERE product_id = ANY($1)
            ORDER BY created_at ASC
            `,
            [productIds]
        );

        return rows.map((row) => ({
            id: row.id,
            productId: row.product_id,
            storageKey: row.storage_key,
            contentType: row.content_type,
            createdAt: row.created_at,
        }));
    }

    async findById(imageId: string): Promise<ProductImageDB | null> {
        const { rows } = await this.db.query(
            `
            SELECT
                id,
                product_id,
                storage_key,
                content_type,
            created_at
            FROM product_images
            WHERE id = $1
            `,
            [imageId]
        );

        if (rows.length === 0) return null;

        const row = rows[0];

        return {
            id: row.id,
            productId: row.product_id,
            storageKey: row.storage_key,
            contentType: row.content_type,
            createdAt: row.created_at,
        };
    }
}