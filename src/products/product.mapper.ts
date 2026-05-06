import { Product } from "./product";
import { ProductResponseDTO } from "./product.types";

export class ProductMapper {
    static toResponse(product: Product): ProductResponseDTO {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            sku: product.sku,
            description: product.description,
            thumbnailUrl: null,
        };
    }

    static toResponseList(products: Product[]): ProductResponseDTO[] {
        return products.map(this.toResponse);
    }
}