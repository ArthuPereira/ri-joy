import { Database } from "../infra/database/postgres";
import { Customer } from "./customer";
import { ICustomeRow, SearchCustomersInput } from "./customer.types";

export interface ICustomerRepository {
    create(customer: Customer): Promise<Customer>;
    existsByEmail(email: string): Promise<boolean>;
    findById(id: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    search(input: SearchCustomersInput): Promise<Customer[]>
    remove(id: string): Promise<boolean>;
    update(customer: Customer): Promise<Customer | null>;
}

export class CustomerRepository implements ICustomerRepository {
    constructor(
        private readonly db: Database
    ) {}

    private toDomain(row: ICustomeRow): Customer {
        return new Customer(
            row.id,
            row.name,
            row.email,
            row.phone,
            row.cpf,
            row.active
        );
    }

    async create(customer: Customer): Promise<Customer> {
        const result = await this.db.query<ICustomeRow>(
            `
            INSERT INTO customers (
                id,
                name,
                email,
                phone,
                cpf,
                active
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, email, phone, cpf, active
            `,
            [
                customer.id,
                customer.name,
                customer.email,
                customer.phone,
                customer.cpf,
                customer.active
            ]
        );

        return this.toDomain(result.rows[0]);
    }

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.db.query(
            `
            SELECT 1
            FROM customers
            WHERE email = $1
            AND active = true
            LIMIT 1
            `,
            [email]
        );

        return result.rows.length > 0;
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const result = await this.db.query<ICustomeRow>(
            `
            SELECT
                id,
                name,
                phone,
                email,
                cpf,
                active
            FROM customers
            WHERE email = $1
            AND active = true
            LIMIT 1
            `,
            [email]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }

    async findById(id: string): Promise<Customer | null> {
        const result = await this.db.query<ICustomeRow>(
            `
            SELECT *
            FROM customers
            WHERE id = $1
            AND active = true
            LIMIT 1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }

    async search(input: SearchCustomersInput): Promise<Customer[]> {
        const { name, email, page, limit } = input;

        const conditions: string[] = ["active = true"];
        const values: Array<string | number | null> = [];

        if (name) {
            values.push(`%${name}%`);
            conditions.push(`name ILIKE $${values.length}`);
        }

        if (email) {
            values.push(`%${email}%`);
            conditions.push(`email ILIKE $${values.length}`);
        }

        const whereClause = `WHERE ${conditions.join(" AND ")}`;
        
        const offset = (page - 1) * limit;
        values.push(limit);
        
        const limitIndex = values.length;
        values.push(offset);
        
        const offsetIndex = values.length;
        
        const query = `
            SELECT
                id,
                name,
                email,
                phone                
            FROM customers
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${limitIndex}
            OFFSET $${offsetIndex}
        `;
        
        const customers = await this.db.query<ICustomeRow>(query, values);
        
        return customers.rows.map(row => this.toDomain(row))
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.db.query(
            `
            UPDATE customers
            SET
                active = false,
                updated_at = NOW()
            WHERE id = $1
            AND active = true
            `,
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }

    async update(customer: Customer): Promise<Customer | null> {
        const result = await this.db.query(
            `
            UPDATE customers
            SET
                email = $1,
                phone = $2,
                updated_at = NOW()
            WHERE id = $3
            AND active = true
            RETURNING *
            `,
            [
            customer.email,
            customer.phone,
            customer.id,
            ]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }
}