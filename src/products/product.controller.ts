import { Request, Response } from "express";

export class ProductController {
    constructor(

    ) {}

    async list(req: Request, res: Response) {
        const products = [
            {"name": "bola", "price": 12.2},
            {"name": "boneco", "price": 20.0},
            {"name": "pião", "price": 5},
        ];

        res.json(products);
    }
}