import { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";
import { OrderMapper } from "./order.mapper";
import { CreateOrderDTO, createOrderSchema, updateOrderStatusSchema, UpdateOrderStatusDTO } from "./order.types";
import { UuidParam, uuidParamSchema } from "../products/product.types";

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

    async getOrderById(req: Request<UuidParam>, res: Response, next: NextFunction) {
        try {
            const params = uuidParamSchema.parse(req.params);

            const order = await this.service.getOrderById(params.id);

            res.status(200).json(OrderMapper.toResponse(order));
        } catch (err) {
            next(err);
        }
    }

    async getOrdersByCustomer(req: Request<UuidParam>, res: Response, next: NextFunction) {
        try {
            const params = uuidParamSchema.parse(req.params);

            const orders = await this.service.getOrdersByCustomer(params.id);

            res.status(200).json(orders);
        } catch (err) {
            next(err);
        }
    }

    async updateOrderStatus(req: Request<UuidParam, {}, UpdateOrderStatusDTO>, res: Response, next: NextFunction) {
        try {
            const { params, body } = updateOrderStatusSchema.parse({
                params: req.params,
                body: req.body,
            });

            const order = await this.service.updateOrderStatus(params.id, body.status);

            res.status(200).json(OrderMapper.toResponse(order));
        } catch (err) {
            next(err)
        }
    }
}