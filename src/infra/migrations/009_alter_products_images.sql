alter table product_images
add column storage_key text,
add column content_type text;

alter table product_images
drop column image_url;