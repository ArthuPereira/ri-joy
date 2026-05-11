import { Database } from "./infra/database/postgres"
import { ProductRepository } from "./products/product.repository";
import { ProductController } from "./products/product.controller"
import { ProductService } from "./products/product.service"
import { CustomerRepository } from "./customers/customer.repository";
import { CustomerService } from "./customers/customer.service";
import { CustomerController } from "./customers/customer.controller";
import { OrderRepository } from "./orders/order.repository";
import { OrderService } from "./orders/order.service";
import { OrderController } from "./orders/order.controller";
import { OrderItemRepository } from "./orders/items/order-item.repository";

export function createApp() {
    const database = new Database();

    const productRepository = new ProductRepository(database);
    const customerRepository = new CustomerRepository(database);
    const orderRepository = new OrderRepository(database);
    const orderItemRepository = new OrderItemRepository(database);

    const productService = new ProductService(productRepository);
    const customerService = new CustomerService(customerRepository);
    const orderService = new OrderService(
        orderRepository,
        orderItemRepository,
        productRepository,
        database
    );

    const productController = new ProductController(productService);
    const customerController = new CustomerController(customerService);
    const orderController = new OrderController(orderService);

    return {
        productController,
        customerController,
        orderController,
    }
}