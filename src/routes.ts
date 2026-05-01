import { Router } from "express";
import { ProductController } from "./products/product.controller";

export function productRoutes(controller: ProductController) {
    const router = Router();

    router.get("/list", controller.list.bind(controller));

    return router;
}