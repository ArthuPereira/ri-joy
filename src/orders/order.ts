import { OrderStatus } from "./order.types";
import { OrderItem } from "./items/order-item";

export class Order {
    private readonly _items: OrderItem[] = [];

    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public status: OrderStatus,
        public readonly createdAt: Date
    ) {}

    addItem(item: OrderItem) {
        this._items.push(item);
    }

    get total(): number {
        return this._items.reduce(
            (sum, item) => sum + item.total,
            0
        );
    }

    markAsDelivered() {
        this.status = OrderStatus.DELIVERED;
    }

    get items(): readonly OrderItem[] {
        return this._items;
    }
}