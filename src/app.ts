import { ProductController } from "./products/product.controller"

export function createApp() {
    const productController = new ProductController()

    return {
        productController
    }
}