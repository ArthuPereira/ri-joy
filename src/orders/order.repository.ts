import { Database, QueryExecutor } from "../database/postgres";
import { Order } from "./order";
import { OrderRow, OrderStatus } from "./order.types";

export interface IOrderRepository {
  create(order: Order, client?: QueryExecutor): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}

export class OrderRepository {
    constructor(
        private readonly db: Database,
    ) {}

    private toDomain(row: OrderRow): Order {
        return new Order(
            row.id,
            row.customer_id,
            row.status,
            row.created_at
        );
    }

    async create(
        order: Order,
        client?: QueryExecutor
    ): Promise<Order> {
        const executor = client ?? this.db;

        const result = await executor.query<OrderRow>(
            `
            INSERT INTO orders (
                id,
                customer_id,
                status,
                total,
                created_at
            )
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
            `,
            [
                order.id,
                order.customerId,
                order.status,
                order.total
            ]
        );

        return this.toDomain(result.rows[0]);
    }

    async findById(id: string): Promise<Order | null> {
        const result = await this.db.query<OrderRow>(
            `
            SELECT *
            FROM orders
            WHERE id = $1
            LIMIT 1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }

    async updateStatus(
        id: string,
        status: OrderStatus
    ): Promise<Order | null> {
        const result = await this.db.query<OrderRow>(
            `
            UPDATE orders
            SET
                status = $1
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.toDomain(result.rows[0]);
    }
}