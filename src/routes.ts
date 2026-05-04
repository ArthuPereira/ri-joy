import { Router } from "express";
import { ProductController } from "./products/product.controller";
import { CustomerController } from "./customer/customer.controller";

export function productRoutes(controller: ProductController) {
    const router = Router();

    router.get("/", controller.list.bind(controller));
    router.post("/", controller.create.bind(controller));
    router.get("/:id", controller.show.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    router.patch("/:id", controller.update.bind(controller));

    return router;
}

export function customerRoutes(controller: CustomerController) {
    const router = Router();

    router.get("/", controller.search.bind(controller))
    router.post("/", controller.create.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    router.patch("/:id", controller.update.bind(controller));

    return router;
}