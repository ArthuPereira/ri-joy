import { UpdateProductDTO } from "./product.types";

export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly sku: string,
        public readonly active: boolean = true,
        public readonly description: string | null = null
  ) {
        if (!name) {
            throw new Error('Produto deve ter nome');
        }

        if (price <= 0) {
            throw new Error('Produto deve ter preço');
        }

        if (!sku) {
            throw new Error('SKU é obrigatório');
        }
    }

    update(data: UpdateProductDTO): Product {
        return new Product(
            this.id,
            data.name ?? this.name,
            data.price ?? this.price,
            this.sku,
            this.active,
            data.description !== undefined ? data.description : this.description
        );
    }
}