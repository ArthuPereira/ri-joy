import { randomUUID } from "crypto";
import { Database } from "../database/postgres";
import { ProductRepository } from "../products/product.repository";
import { OrderItemRepository } from "./items/order-item.repository";
import { Order } from "./order";
import { OrderRepository } from "./order.repository";
import { CreateOrderDTO, OrderStatus } from "./order.types";
import { OrderItem } from "./items/order-item";
import { OrderItemsRequiredError, OrderProductNotFoundError } from "../errors/order.errors";

export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly productRepository: ProductRepository,
        private readonly db: Database,
    ) {}

    async create(dto: CreateOrderDTO): Promise<Order> {
        if (dto.items.length === 0) {
            throw new OrderItemsRequiredError();
        }

        const productIds = dto.items.map(item => item.productId);

        const products = await this.productRepository.findByIds(productIds);

        const productMap = new Map(
            products.map(product => [product.id, product])
        );

        const order = new Order(
            randomUUID(),
            dto.customerId,
            OrderStatus.PENDING,
            new Date()
        );

        dto.items.forEach(item => {
            const product = productMap.get(item.productId);

            if (!product) {
                throw new OrderProductNotFoundError();
            }

            const orderItem = OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
            });

            order.addItem(orderItem);
        });

        return this.db.transaction(async (client) => {
            await this.orderRepository.create(order, client);

            await this.orderItemRepository.createMany(
                order.items,
                client
            );

            return order;
        });
    }
}