import { Router } from "express";
import { ProductController } from "./products/product.controller";
import { CustomerController } from "./customers/customer.controller";
import { OrderController } from "./orders/order.controller";
import { uploadMiddleware } from "./middlewares/upload";

export function productRoutes(controller: ProductController) {
    const router = Router();

    router.get("/", controller.search.bind(controller));
    router.post("/", controller.create.bind(controller));
    router.post("/:id/images", uploadMiddleware.single("image"), controller.uploadImage.bind(controller));
    router.get("/:id/images", controller.listImages.bind(controller));
    router.delete("/:productId/images/:imageId",controller.deleteImage.bind(controller));
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
    router.get("/:id", controller.getOrderById.bind(controller));
    router.get("/customer/:id", controller.getOrdersByCustomer.bind(controller));
    router.patch("/:id/status", controller.updateOrderStatus.bind(controller));

    return router;
};