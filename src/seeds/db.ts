import { randomUUID } from "crypto";
import { db } from "./seed";

export const products = [
  {
    id: randomUUID(),
    name: "Camiseta Infantil Dinossauro",
    price: 39.9,
    sku: "INF-CAM-01",
    imageKey: "products/camiseta-dinossauro.jpg",
    fileName: "camiseta-dinossauro.jpg",
  },
  {
    id: randomUUID(),
    name: "Vestido Infantil Floral",
    price: 59.9,
    sku: "INF-VES-01",
    imageKey: "products/vestido-floral.jpg",
    fileName: "vestido-floral.jpg",
  },
  {
    id: randomUUID(),
    name: "Boneco Educativo Animais",
    price: 49.9,
    sku: "INF-BRQ-01",
    imageKey: "products/boneco-animais.jpg",
    fileName: "boneco-animais.jpg",
  },
  {
    id: randomUUID(),
    name: "Quebra-Cabeça Infantil 50 Peças",
    price: 34.9,
    sku: "INF-BRQ-02",
    imageKey: "products/quebra-cabeca-50.jpg",
    fileName: "quebra-cabeca-50.jpg",
  },
  {
    id: randomUUID(),
    name: "Pista Ataque do tubarão",
    price: 44.9,
    sku: "INF-BRQ-03",
    imageKey: "products/ataque-tubarão.jpg",
    fileName: "pista-carrinho.jpg",
  },
];

export async function seedDb() {
  await db.transaction(async (client) => {
    for (const product of products) {
      // products
      await client.query(
        `
        INSERT INTO products (
          id, name, price, sku, active
        ) VALUES (
          $1, $2, $3, $4, true
        )
        `,
        [
          product.id,
          product.name,
          product.price,
          product.sku,
        ]
      );

      // product_images
      const imageId = randomUUID();
      const contentType = "image/jpeg"
      await client.query(
        `
        INSERT INTO product_images (
          id, product_id, storage_key, content_type
        ) VALUES (
          $1, $2, $3, $4
        )
        `,
        [
          imageId,
          product.id,
          product.imageKey,
          contentType
        ]
      );
    }
  });
}