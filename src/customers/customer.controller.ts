import { Request, Response } from "express";
import { CustomerService } from "./customer.service";
import { CreateCustomerDTO, CustomerQuery, UpdateCustomerDTO } from "./customer.types";
import { validate } from "uuid";

export class CustomerController {
    constructor(
        private readonly service: CustomerService
    ) {}

    async create(req: Request<{}, {}, CreateCustomerDTO>, res: Response) {
        const { name, email, phone, cpf } = req.body;

        if (!name || !email || !phone || !cpf === undefined) {
            return res.status(400).json({ message: "campos obrigatórios faltando" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Email deve ser válido" });
        }

        const customer = await this.service.create(req.body);

        return res.status(201).json(customer)
    }

    async search(req: Request<{}, {}, {}, CustomerQuery>, res: Response) {
        const { name, email, page, limit } = req.query;

        const pageNumber = page ? Number(page) : 1;
        const limitNumber = limit ? Number(limit) : 20;

        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ message: "Página inválida" });
        }

        if (!Number.isInteger(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ message: "Limite inválido" });
        }

        if (name !== undefined && typeof name !== "string") {
            return res.status(400).json({ message: "Nome inválido" });
        }

        if (email !== undefined && typeof email !== "string") {
            return res.status(400).json({ message: "Email inválido" });
        }

        const filters = {
            name,
            email,
            page: pageNumber,
            limit: limitNumber,
        };

        const customers = await this.service.search(filters);

        return res.status(200).json(customers);
    }

    async delete(req: Request<{ id: string}>, res: Response) {
        const { id } = req.params;

        if (!validate(id)) {
            return res.status(400).json({ message: "ID é obrigatório" });
        }

        const deleted = await this.service.remove(id);

        if (!deleted) {
            return res.status(400).json({ message: "Remoção falhou, pois o produto não existe" });
        }

        return res.status(204).send();
    }

    async update(req: Request<{ id: string }, {}, UpdateCustomerDTO>, res: Response) {
        const { id } = req.params;
        const { email, phone } = req.body ?? {};

        if (!validate(id)) {
            return res.status(400).json({ message: "ID é obrigatório" });
        }

        const updated = await this.service.update(id, { email, phone });

        if (!updated) {
            return res.status(400).json({ message: "Atualização falhou" });
        }

        return res.status(200).json(updated);
    }
}