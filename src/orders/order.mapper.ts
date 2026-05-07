import { Order } from "./order";
import { OrderResponseDTO, OrderRow, OrderSummary } from "./order.types";

export class OrderMapper {
    static toResponse(order: Order): OrderResponseDTO {
        return {
            id: order.id,
            customerId: order.customerId,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                total: item.total,
                unitPrice: item.unitPrice,
            })),
        };
    }

    static toSummary(row: OrderRow): OrderSummary {
        return {
            id: row.id,
            customerId: row.customer_id,
            status: row.status,
            total: Number(row.total),
            createdAt: row.created_at,
        };
    }

    static toDomain(row: OrderRow): Order {
        return new Order(
            row.id,
            row.customer_id,
            row.status,
            row.created_at
        );
    }
}