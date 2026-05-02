import { Request, Response } from "express";
import { ProductService } from "./product.service"

export class ProductController {
    constructor(
        private readonly service: ProductService
    ) {}

    async list(req: Request, res: Response) {
        const products = await this.service.list();

        res.json(products);
    }
}