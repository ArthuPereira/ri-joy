import { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";
import { OrderMapper } from "./order.mapper";
import { CreateOrderDTO, createOrderSchema } from "./order.types";

export class OrderController {
    constructor(
        private readonly service: OrderService,
    ) {}

    async create(req: Request<{}, {}, CreateOrderDTO>, res: Response, next: NextFunction) {
        try {
            const { body } = createOrderSchema.parse({ body: req.body });
            const order = await this.service.create(body);
            
            res.status(201).json(OrderMapper.toResponse(order));
        } catch (err) {
            next(err);
        }
    }
}