import { ProductController } from "./products/product.controller"
import { loadDatabaseConfig } from "./util/load-env";
import { Database } from "./database/postgres"

export function createApp() {
    const database = new Database(loadDatabaseConfig());

    const productController = new ProductController();

    return {
        productController
    }
}