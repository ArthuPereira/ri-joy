import { Database } from "../../database/postgres";
import { OrderItem } from "./order-item";
import { QueryExecutor } from "../../database/postgres";
import { OrderItemRow } from "./order-item.types";

export interface IOrderItemRepository {
    createMany(items: readonly OrderItem[], client: QueryExecutor): Promise<void>;
    findManyByOrderId(orderId: string): Promise<OrderItem[]>;
    findManyByConsumerId(consumerId: string): Promise<OrderItem[]>;
}

export class OrderItemRepository implements IOrderItemRepository {
    constructor(
        private readonly db: Database
    ) {}

    private toDomain(row: OrderItemRow): OrderItem {
        return OrderItem.restore(
        {
            orderId: row.order_id,
            productId: row.product_id,
            quantity: row.quantity,
            unitPrice: Number(row.unit_price),
        },
        row.id
        );
    }

    async createMany(
        items: readonly OrderItem[],
        client: QueryExecutor
    ): Promise<void> {
        if (items.length === 0) {
            return;
        }

        const values: any[] = [];
        const placeholders: string[] = [];

        items.forEach((item, index) => {
            const baseIndex = index * 6;

            placeholders.push(
                `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`
            );

            values.push(
                item.id,
                item.orderId,
                item.productId,
                item.quantity,
                item.unitPrice,
                item.total
            );
        });

        await client.query(
            `
            INSERT INTO order_items (
                id,
                order_id,
                product_id,
                quantity,
                unit_price,
                total
            )
            VALUES ${placeholders.join(", ")}
            `, values
        );
    }

    async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
        const result = await this.db.query<OrderItemRow>(
            `
            SELECT *
            FROM order_items
            WHERE order_id = $1
            `,
            [orderId]
        );

        return result.rows.map(row => this.toDomain(row));
    }

    async findManyByConsumerId(consumerId: string): Promise<OrderItem[]> {
        const result = await this.db.query<OrderItemRow>(
            `
            SELECT *
            FROM order_items
            WHERE consumer_id = $1
            `,
            [consumerId]
        );

        return result.rows.map(row => this.toDomain(row));
    }
}