CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT fk_product_images_product
      FOREIGN KEY (product_id)
      REFERENCES products(id)
      ON DELETE CASCADE
);