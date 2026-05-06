import { Order } from "./order";
import { OrderResponseDTO } from "./order.types";

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

    static toResponseList(orders: Order[]): OrderResponseDTO[] {
        return orders.map(order => this.toResponse(order));
    }
}