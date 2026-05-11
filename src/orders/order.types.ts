import z from "zod";
import { uuidParamSchema } from "../products/product.types";

const orderItemSchema = z.object({
  productId: z.string().uuid("productId inválido"),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
});

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string().uuid("customerId inválido"),
    items: z
      .array(orderItemSchema)
      .min(1, "O pedido deve ter pelo menos um item"),
  }),
});

export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  PAID = "PAID", 
  CANCELLED = "CANCELLED"
}

export const updateOrderStatusSchema = z.object({
  params: uuidParamSchema,
  body: z.object({
      status: z.nativeEnum(OrderStatus),
  }),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>["body"];
export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>["body"];

export interface OrderItemResponseDTO {
    productId: string;
    quantity: number;
    total: number;
    unitPrice: number;
}

export interface OrderResponseDTO {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  items: OrderItemResponseDTO[];
}

export interface OrderRow {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total: number;
  created_at: Date;
}

export interface OrderSummary {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
}