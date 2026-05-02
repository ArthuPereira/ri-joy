export interface IProductRow {
    id: string;
    name: string;
    price: number;
    description: string | null;
}

export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly description?: string
    ) {
        if (price <= 0) {
            throw new Error('Preço não pode ser negativo');
        }

        if (!name) {
            throw new Error('Produto deve ter nome');
        }
    }
}