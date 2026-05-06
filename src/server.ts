import { createApp } from "./app";
import { customerRoutes, orderRoutes, productRoutes } from "./routes";
import express from "express";
import 'dotenv/config';
import { errorMiddleware } from "./middlewares/error";

const app = createApp()
const server = express()

server.use(express.json())

server.use("/products", productRoutes(app.productController))
server.use("/customers", customerRoutes(app.customerController))
server.use("/orders", orderRoutes(app.orderController));

server.use(errorMiddleware);

server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
})
