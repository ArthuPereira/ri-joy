import { Product } from "./product";
import { ProductRepository } from "./product.repository";

export class ProductService {
    constructor(
        private readonly repo: ProductRepository
    ) {}

    async list(): Promise<Product[]> {
        const products = await this.repo.list();

        return products;
    }
}