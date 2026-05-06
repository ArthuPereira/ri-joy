import { InvalidLimitError, InvalidPageError, InvalidPriceRangeError, ProductNotFoundError, ProductUpdateFailedError, SkuAlreadyExistsError } from "../errors/product.errors";
import { Product } from "./product";
import { IProductRepository } from "./product.repository";
import { CreateProductDTO, ListProductQuery, UpdateProductDTO } from "./product.types";
import { randomUUID } from "crypto";

export class ProductService {
    constructor(
        private readonly repo: IProductRepository
    ) {}

    async search(query: ListProductQuery): Promise<Product[]> {
        const { minPrice, maxPrice, page, limit } = query;

        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            throw new InvalidPriceRangeError();
        }

        if (page < 1) {
            throw new InvalidPageError();
        }

        if (limit < 1 || limit > 100) {
            throw new InvalidLimitError();
        }
        
        return await this.repo.search(query);
    }

    async create(dto: CreateProductDTO): Promise<Product> {      
        const existSku = await this.repo.existsBySku(dto.sku);

        if (existSku) {
            throw new SkuAlreadyExistsError();
        }  

        const product = new Product(
            randomUUID(),
            dto.name,
            dto.price,
            dto.sku,
            true,
            dto.description
        );

        return this.repo.create(product);
    }

    async show(id: string): Promise<Product> {
        const product = await this.repo.findById(id);

        if (!product) {
            throw new ProductNotFoundError();
        }

        return product;
    }

    async remove(id: string): Promise<void> {
        await this.show(id);
        await this.repo.remove(id);
    }

    async update(id: string, data: UpdateProductDTO): Promise<Product> {
        const product = await this.repo.findById(id);

        if (!product) {
            throw new ProductNotFoundError();
        }

        const updated = product.update(data);
        const result = await this.repo.update(updated);

        if (!result) {
            throw new ProductUpdateFailedError();
        }

        return result;
    }
}