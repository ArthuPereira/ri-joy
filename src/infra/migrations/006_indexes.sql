CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);