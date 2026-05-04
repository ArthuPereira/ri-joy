import { Database } from "./database/postgres"
import { loadDatabaseConfig } from "./util/load-env";
import { ProductRepository } from "./products/product.repository";
import { ProductController } from "./products/product.controller"
import { ProductService } from "./products/product.service"
import { CustomerRepository } from "./customer/customer.repository";
import { CustomerService } from "./customer/customer.service";
import { CustomerController } from "./customer/customer.controller";

export function createApp() {
    const database = new Database(loadDatabaseConfig());

    const productRepository = new ProductRepository(database);
    const customerRepository = new CustomerRepository(database);

    const productService = new ProductService(productRepository);
    const customerService = new CustomerService(customerRepository)

    const productController = new ProductController(productService);
    const customerController = new CustomerController(customerService)

    return {
        productController,
        customerController
    }
}