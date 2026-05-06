import { randomUUID } from "crypto";
import { OrderItemIdRequiredError, OrderItemInvalidQuantityError, OrderItemInvalidUnitPriceError, OrderItemProductIdRequiredError } from "../../errors/order.errors";

interface OrderItemProps {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItem {
    private readonly _id: string;
    private readonly _orderId: string;
    private readonly _productId: string;
    private readonly _quantity: number;
    private readonly _unitPrice: number;
    private readonly _total: number;

    private constructor(props: OrderItemProps, id?: string) {
        this._id = id ?? randomUUID();
        this._orderId = props.orderId;
        this._productId = props.productId;
        this._quantity = props.quantity;
        this._unitPrice = props.unitPrice;
        this._total = props.unitPrice * props.quantity;

        this.validate();
    }

    static create(props: OrderItemProps): OrderItem {
        return new OrderItem(props);
    }
    
    private validate() {
        if (!this._orderId) {
            throw new OrderItemIdRequiredError();
        }

        if (!this._productId) {
            throw new OrderItemProductIdRequiredError();
        }
        
        if (this._quantity <= 0) {
            throw new OrderItemInvalidQuantityError();
        }

        if (this._unitPrice < 0) {
            throw new OrderItemInvalidUnitPriceError();
        }
    }

    static restore(props: OrderItemProps, id: string): OrderItem {
        return new OrderItem(props, id);
    }

    get id() {
        return this._id;
    }

    get orderId() {
        return this._orderId;
    }

    get productId() {
        return this._productId;
    }

    get quantity() {
        return this._quantity;
    }

    get unitPrice() {
        return this._unitPrice;
    }

    get total() {
        return this._total;
    }
}