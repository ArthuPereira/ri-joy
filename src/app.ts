import { Database } from "./database/postgres"
import { loadDatabaseConfig } from "./util/load-env";
import { ProductRepository } from "./products/product.repository";
import { ProductController } from "./products/product.controller"
import { ProductService } from "./products/product.service"

export function createApp() {
    const database = new Database(loadDatabaseConfig());

    const productRepository = new ProductRepository(database)

    const productService = new ProductService(productRepository)

    const productController = new ProductController(productService);

    return {
        productController
    }
}