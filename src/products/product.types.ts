import { z } from "zod";

const uuidParam = z.object({
  id: z.string().uuid("ID inválido"),
});

const positivePrice = z
  .number("Preço deve ser um número")
  .positive("Preço deve ser maior que zero");

export const listProductSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    minPrice: z.coerce.number().nonnegative("minPrice inválido").optional(),
    maxPrice: z.coerce.number().nonnegative("maxPrice inválido").optional(),
    page: z.coerce.number().int().min(1, "Página inválida").default(1),
    limit: z.coerce.number().int().min(1, "Limite inválido").default(20),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    sku: z.string().min(1, "SKU é obrigatório"),
    price: positivePrice,
    description: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: uuidParam,
  body: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      price: positivePrice.optional(),
    })
    .refine(
      ({ name, description, price }) =>
        name !== undefined || description !== undefined || price !== undefined,
      { message: "Nenhum campo informado para atualizar" }
    ),
});

export const idParamSchema = z.object({
  params: uuidParam,
});

export type ListProductQuery = z.infer<typeof listProductSchema>["query"];
export type CreateProductDTO = z.infer<typeof createProductSchema>["body"];
export type UpdateProductDTO = z.infer<typeof updateProductSchema>["body"];
export type UuidParam = z.infer<typeof idParamSchema>["params"];

export interface ProductRow {
  id: string;
  name: string;
  price: number;
  description: string | null;
  sku: string;
  active: boolean;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  price: number;
  sku: string;
  description: string | null;
  thumbnailUrl: string | null;
}