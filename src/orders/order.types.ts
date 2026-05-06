import z from "zod";

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

export type CreateOrderDTO = z.infer<typeof createOrderSchema>["body"];

export interface OrderResponseDTO {};

export enum OrderStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
}

export interface OrderRow {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total: number;
  created_at: Date;
}