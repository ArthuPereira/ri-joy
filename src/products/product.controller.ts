import { Request, Response } from "express";
import { ProductService } from "./product.service"
import { CreateProductDTO, ProductQuery, UpdateProductDTO } from "./product.types";
import { validate } from "uuid";

export class ProductController {
    constructor(
        private readonly service: ProductService
    ) {}

    async list(req: Request<{}, {}, {}, ProductQuery>, res: Response) {
        const { name, minPrice, maxPrice, page, limit } = req.query;

        const pageNumber = page ? Number(page) : 1;
        const limitNumber = limit ? Number(limit) : 20;

        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ message: "Página inválida" });
        }

        if (!Number.isInteger(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ message: "Limite invalido" });
        }

        if (minPrice !== undefined && isNaN(Number(minPrice))) {
            return res.status(400).json({ message: "minPrice inválido" });
        }

        if (maxPrice !== undefined && isNaN(Number(maxPrice))) {
            return res.status(400).json({ message: "maxPrice inválido" });
        }

        const filters = {
            name,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            page: pageNumber,
            limit: limitNumber,
        };

        const products = await this.service.list(filters);

        return res.status(200).json(products);
    }

    async create(req: Request<{}, {}, CreateProductDTO>, res: Response) {
        const { name, price, sku } = req.body;

        if (!name || !sku || price === undefined) {
            return res.status(400).json({ message: "campos obrigatórios faltando" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Preço deve ser maior que zero" });
        }

        const product = await this.service.create(req.body);

        return res.status(201).json(product)
    }

    async show(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        if (!validate(id)) {
            return res.status(400).json({ message: "ID é obrigatório" });
        }

        const product = await this.service.show(id);

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        return res.status(200).json(product);
    }

    async delete(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const deleted = await this.service.remove(id);

        if (!deleted) {
            return res.status(400).json({ message: "Remoção falhou, pois o produto não existe" });
        }

        return res.status(204).send();
    }

    async update(req: Request<{ id: string }, {}, UpdateProductDTO>, res: Response) {
        const { id } = req.params;
        const { name, description, price } = req.body ?? {};

        if (!validate(id)) {
            return res.status(400).json({ message: "ID é obrigatório" });
        }

        if (!name && !description && price === undefined) {
            return res.status(400).json({ message: "Nenhum campo informado para atualizar" });
        }

        if (price !== undefined && price <= 0) {
            return res.status(400).json({ message: "Preço deve ser maior que zero" });
        }

        const updated = await this.service.update(id, { name, description, price });

        if (!updated) {
            return res.status(400).json({ message: "Atualização falhou" });
        }

        return res.status(200).json(updated);
    }
}