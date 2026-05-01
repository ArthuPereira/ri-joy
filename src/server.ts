import { createApp } from "./app";
import { productRoutes } from "./routes";
import express from "express";

const app = createApp()
const server = express()

server.use("/products", productRoutes(app.productController))

server.listen(3000, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
})
