import { Router } from "express";
import { ProductController } from "./products/product.controller";
import { CustomerController } from "./customers/customer.controller";
import { OrderController } from "./orders/order.controller";

export function productRoutes(controller: ProductController) {
    const router = Router();

    router.get("/", controller.search.bind(controller));
    router.post("/", controller.create.bind(controller));
    router.get("/:id", controller.show.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    router.patch("/:id", controller.update.bind(controller));

    return router;
}

export function customerRoutes(controller: CustomerController) {
    const router = Router();

    router.get("/", controller.search.bind(controller));
    router.post("/", controller.create.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    router.patch("/:id", controller.update.bind(controller));

    return router;
}

export function orderRoutes(controller: OrderController) {
    const router = Router();

    router.post("/", controller.create.bind(controller));

    return router;
};