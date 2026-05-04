import { AppError } from "./domain";

export class ProductNotFoundError extends AppError {
    readonly statusCode = 404;
    constructor() {
        super("Produto não encontrado");
    }
}

export class SkuAlreadyExistsError extends AppError {
    readonly statusCode = 409;
    constructor() {
        super("SKU já cadastrado");
    }
}

export class ProductUpdateFailedError extends AppError {
    readonly statusCode = 400;
    constructor() {
        super("Falha ao atualizar produto");
    }
}