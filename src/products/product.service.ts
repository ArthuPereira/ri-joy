import { Product } from "./product";
import { IProductRepository } from "./product.repository";
import { CreateProductDTO, ListProductsInput, UpdateProductDTO } from "./product.types";
import { randomUUID } from "crypto";

export class ProductService {
    constructor(
        private readonly repo: IProductRepository
    ) {}

    async list(input: ListProductsInput): Promise<Product[]> {
        const { minPrice, maxPrice, page, limit } = input;

        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            throw new Error("minPrice não pode ser maior que maxPrice");
        }

        if (page < 1) {
            throw new Error("page deve ser maior que 0");
        }

        if (limit < 1 || limit > 100) {
            throw new Error("limit deve ser entre 1 e 100");
        }
        
        return await this.repo.list(input);
    }

    async create(dto: CreateProductDTO): Promise<Product> {      
        const existSku = await this.repo.existsBySku(dto.sku);

        if (existSku) {
            throw new Error("SKU já cadastrado");
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

    async show(id: string): Promise<Product | null> {
        const product = await this.repo.findById(id);

        if (!product) {
            throw new Error("Produto inexistente");
        }

        return product;
    }

    async remove(id: string): Promise<boolean> {
        return await this.repo.remove(id);
    }

    async update(id: string, data: UpdateProductDTO): Promise<Product> {
        const product = await this.repo.findById(id);

        if (!product) {
            throw new Error("Produto inexistente");
        }

        const updated = product.update(data);
        const result = await this.repo.update(updated);

        if (!result) {
            throw new Error("Falha ao atualizar");
        }

        return result;
    }
}