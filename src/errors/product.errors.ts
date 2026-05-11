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
    readonly statusCode = 500;
    constructor() {
        super("Falha ao atualizar produto");
    }
}

export class ProductNameRequiredError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Produto deve ter nome");
    }
}

export class ProductPriceInvalidError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Produto deve ter preço válido");
    }
}

export class InvalidPriceRangeError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("minPrice não pode ser maior que maxPrice ");
    }
}

export class InvalidPageError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("page deve ser maior que 0");
    }
}

export class InvalidLimitError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("limit deve ser entre 1 e 100");
    }
}

export class FileRequiredError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Arquivo é obrigatório");
    }
}

export class InvalidImageMimeTypeError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Arquivo deve ser uma imagem (ex: jpg / png)");
    }
}

export class InvalidImageExtensionError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Extensão de imagem inválida");
    }
}

export class ProductImageNotFoundError extends AppError {
    readonly statusCode = 404;

    constructor() {
        super("Imagem não encontrada");
    }
}

export class ProductImageUnauthorizedError extends AppError {
    readonly statusCode = 403;

    constructor() {
        super("Imagem não pertence ao produto");
    }
}