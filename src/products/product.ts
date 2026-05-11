import { ProductNameRequiredError, ProductPriceInvalidError, SkuAlreadyExistsError } from "../errors/product.errors";
import { ProductImage, UpdateProductDTO } from "./product.types";

export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly sku: string,
        public readonly active: boolean = true,
        public readonly description: string | null = null,
        public readonly images: ProductImage[] = []
    ) {
        if (!name) {
            throw new ProductNameRequiredError();
        }

        if (price <= 0) {
            throw new ProductPriceInvalidError();
        }

        if (!sku) {
            throw new SkuAlreadyExistsError();
        }
    }

    update(data: UpdateProductDTO): Product {
        const name = data.name ?? this.name;
        const price = data.price ?? this.price;

        if (name.length === 0) {
            throw new ProductNameRequiredError();
        }

        if (price <= 0) {
            throw new ProductPriceInvalidError();
        }

        return new Product(
            this.id,
            name,
            price,
            this.sku,
            this.active,
            data.description ?? this.description,
            this.images
        );
    }
}