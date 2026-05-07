import { AppError } from "../errors/domain";

export class OrderItemsRequiredError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Pedido deve ter pelo menos um item");
    }
}

export class OrderProductNotFoundError extends AppError {
    readonly statusCode = 404;

    constructor() {
        super("Um ou mais produtos não foram encontrados");
    }
}

export class OrderNotFoundError extends AppError {
    readonly statusCode = 404;

    constructor() {
        super("Pedido não encontrado");
    }
}

export class OrderItemIdRequiredError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("orderId é obrigatório");
    }
}

export class OrderItemProductIdRequiredError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("productId é obrigatório");
    }
}

export class OrderItemInvalidQuantityError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Quantidade deve ser maior que zero");
    }
}

export class OrderItemInvalidUnitPriceError extends AppError {
    readonly statusCode = 400;

    constructor() {
        super("Preço unitário não pode ser negativo");
    }
}