import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service"
import { CreateProductDTO, uuidParamSchema, ListProductQuery, UpdateProductDTO, UuidParam, DeleteImageParams, deleteImageParamsSchema, updateProductBodySchema, updateProductParamsSchema, createProductBodySchema, listProductQuerySchema } from "./product.types";

import { FileRequiredError, InvalidImageExtensionError, InvalidImageMimeTypeError } from "../errors/product.errors";

export class ProductController {
    constructor(
        private readonly service: ProductService
    ) {}

    async search(req: Request<{}, {}, {}, ListProductQuery>, res: Response, next: NextFunction) {
        try {
            const query = listProductQuerySchema.parse(req.query);
            const products = await this.service.search(query);

            res.status(200).json(products);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request<{}, {}, CreateProductDTO>, res: Response, next: NextFunction) {
        try {
            const body = createProductBodySchema.parse(req.body);
            const product = await this.service.create(body);

            res.status(201).json(product);
        } catch (err) {
            next(err);
        }
    }

    async uploadImage(req: Request<UuidParam>, res: Response, next: NextFunction) {
        try {
            const params = uuidParamSchema.parse(req.params);

            if (!req.file) {
                throw new FileRequiredError();
            }

            const { buffer, mimetype, originalname } = req.file;

            const extension = originalname.split(".").pop()?.toLowerCase();
            if (!extension) {
                throw new InvalidImageExtensionError();
            }

            if (!mimetype.startsWith("image/")) {
                throw new InvalidImageMimeTypeError();
            }

            const image = await this.service.uploadImage({
                productId: params.id,
                buffer,
                contentType: mimetype,
                extension,
            });

            return res.status(201).json(image);
        } catch (err) {
            next(err);
        }
    }

    async listImages(req: Request<UuidParam>, res: Response, next: NextFunction) {
        try {
            const params = uuidParamSchema.parse(req.params);

            const images = await this.service.listImages(params.id);

            return res.status(200).json(images);
        } catch (err) {
            next(err);
        }
    }

    async deleteImage(req: Request<DeleteImageParams>, res: Response, next: NextFunction) {
        try {
            const { productId, imageId } = deleteImageParamsSchema.parse(req.params);

            await this.service.deleteImage(productId, imageId);

            return res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async show(req: Request<UuidParam>, res: Response, next: NextFunction) {
        try {
            const params = uuidParamSchema.parse(req.params);
            const product = await this.service.show(params.id);

            res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request<UuidParam>, res: Response, next: NextFunction) {
        try {
            const params = uuidParamSchema.parse(req.params);

            await this.service.remove(params.id);

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request<UuidParam, {}, UpdateProductDTO>, res: Response, next: NextFunction) {
        try {
            const { id } = updateProductParamsSchema.parse(req.params);
            const body = updateProductBodySchema.parse(req.body);

            const updated = await this.service.update(id, body);

            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    }
}