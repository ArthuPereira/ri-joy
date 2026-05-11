import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

const positivePrice = z
  .number("Preço deve ser um número")
  .positive("Preço deve ser maior que zero");

export const listProductQuerySchema = z.object({
  name: z.string().optional(),
  minPrice: z.coerce.number().nonnegative("minPrice inválido").optional(),
  maxPrice: z.coerce.number().nonnegative("maxPrice inválido").optional(),
  page: z.coerce.number().int().min(1, "Página inválida").default(1),
  limit: z.coerce.number().int().min(1, "Limite inválido").default(20),
});

export const createProductBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  price: positivePrice,
  description: z.string().optional(),
});

export const updateProductBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: positivePrice.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.price !== undefined,
    {
      message: "Nenhum campo informado para atualizar",
    }
  );

export const updateProductParamsSchema = uuidParamSchema;

export const uploadProductImageInputSchema = z.object({
  productId: z.string().uuid(),
  buffer: z.instanceof(Buffer),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  extension: z.enum(["jpg", "jpeg", "png", "webp"]),
});

export const deleteImageParamsSchema = z.object({
  productId: z.string().uuid(),
  imageId: z.string().uuid(),
});

export type UploadProductImageInput = z.infer<typeof uploadProductImageInputSchema>;
export type ListProductQuery = z.infer<typeof listProductQuerySchema>;
export type CreateProductDTO = z.infer<typeof createProductBodySchema>;
export type UpdateProductDTO = z.infer<typeof updateProductBodySchema>;
export type UuidParam = z.infer<typeof uuidParamSchema>;
export type DeleteImageParams = z.infer<typeof deleteImageParamsSchema>;

export interface ProductRow {
  id: string;
  name: string;
  price: number;
  description: string | null;
  sku: string;
  active: boolean;
}

export type ProductResponseDTO = {
    id: string;
    name: string;
    price: number;
    sku: string;
    description: string | null;
    thumbnailUrl: string | null;
    images: ProductImageDTO[];
};

export type ProductImageDTO = {
    id: string;
    url: string;
    createdAt: Date;
};

// pertence ao seu repository
export type ProductImageDB = {
    id: string;
    productId: string;
    storageKey: string;
    contentType: string;
    createdAt: Date;
};

export type ProductImage = {
    id: string;
    productId: string;
    storageKey: string;
    contentType: string;
    createdAt: Date;
};