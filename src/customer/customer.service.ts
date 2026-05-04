import { randomUUID } from "crypto";
import { Customer } from "./customer";
import { ICustomerRepository } from "./customer.repository";
import { CreateCustomerDTO, SearchCustomersInput, UpdateCustomerDTO } from "./customer.types";

export class CustomerService {
    constructor(
        private readonly repo: ICustomerRepository
    ) {}

    async create(dto: CreateCustomerDTO): Promise<Customer> {
        const existEmail = await this.repo.existsByEmail(dto.email);

        if (existEmail) {
            throw new Error("Email já cadastrado");
        }

        const customer = new Customer(
            randomUUID(),
            dto.name,
            dto.email,
            dto.phone,
            dto.cpf,
            true
        );

        return this.repo.create(customer);
    }

    async search(input: SearchCustomersInput): Promise<Customer[]> {
        const { page, limit } = input;

        if (page < 1) {
            throw new Error("page deve ser maior que 0");
        }

        if (limit < 1 || limit > 100) {
            throw new Error("limit deve ser entre 1 e 100");
        }

        return this.repo.search(input);
    }

    async remove(id: string): Promise<boolean> {
        return await this.repo.remove(id);
    }

    async update(id: string, data: UpdateCustomerDTO): Promise<Customer> {
        const customer = await this.repo.findById(id);

        if (!customer) {
            throw new Error("Produto inexistente");
        }

        const updated = customer.update(data);
        const result = await this.repo.update(updated);

        if (!result) {
            throw new Error("Falha ao atualizar");
        }

        return result;
    }
}