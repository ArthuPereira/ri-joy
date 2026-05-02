import { createApp } from "./app";
import { productRoutes } from "./routes";
import express from "express";
import 'dotenv/config';

const app = createApp()
const server = express()

server.use("/products", productRoutes(app.productController))

server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
})
