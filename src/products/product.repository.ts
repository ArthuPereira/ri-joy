import { Database } from "../database/postgres";
import { IProductRow, Product } from "./product";

interface IProductRepository {
    list(): Promise<Product[]>;
}

export class ProductRepository implements IProductRepository{
    constructor(
        private readonly db: Database
    ) {}

    async list(): Promise<Product[]> {
        const products = await this.db.query(
            "SELECT * FROM products"
        );

        return products.rows.map(this.toDomain)
    }

    private toDomain(row: IProductRow): Product {
        return {
            id: row.id,
            name: row.name,
            price: row.price,
            description: row.description ?? undefined
        };
    }
}