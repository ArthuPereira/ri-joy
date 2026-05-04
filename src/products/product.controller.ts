import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service"
import { CreateProductDTO, createProductSchema, idParamSchema, ListProductQuery, listProductSchema, UpdateProductDTO, updateProductSchema } from "./product.types";

export class ProductController {
    constructor(
        private readonly service: ProductService
    ) {}

    async search(req: Request<{}, {}, {}, ListProductQuery>, res: Response, next: NextFunction) {
        try {
            const { query } = listProductSchema.parse({ query: req.query });
            const products = await this.service.search(query);

            res.status(200).json(products);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request<{}, {}, CreateProductDTO>, res: Response, next: NextFunction) {
        try {
            const { body } = createProductSchema.parse({ body: req.body });
            const product = await this.service.create(body);

            res.status(201).json(product);
        } catch (err) {
            next(err);
        }
    }

    async show(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const { params } = idParamSchema.parse({ params: req.params });
            const product = await this.service.show(params.id);

            if (!product) {
                throw new Error("Produto não encontrado");
            }

            res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const { params } = idParamSchema.parse({ params: req.params });
            const deleted = await this.service.remove(params.id);

            if (!deleted) {
                throw new Error("Produto não encontrado");
            }

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request<{ id: string }, {}, UpdateProductDTO>, res: Response, next: NextFunction) {
        try {
            const { params, body } = updateProductSchema.parse({
                params: req.params,
                body: req.body,
            });

            const updated = await this.service.update(params.id, body);

            if (!updated) {
                throw new Error("Produto não encontrado");
            }

            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    }
}