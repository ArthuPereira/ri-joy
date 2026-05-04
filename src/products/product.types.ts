export interface CreateProductDTO {
  name: string;
  price: number;
  sku: string;
  description?: string;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  description?: string;
}

export interface IProductRow {
  id: string;
  name: string;
  price: number;
  description: string | null;
  sku: string;
  active: boolean;
}

export interface ProductQuery {
  name?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

export interface ListProductsInput {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}