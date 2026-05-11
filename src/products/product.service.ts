import { InvalidLimitError, InvalidPageError, InvalidPriceRangeError, ProductImageNotFoundError, ProductImageUnauthorizedError, ProductNotFoundError, ProductUpdateFailedError, SkuAlreadyExistsError } from "../errors/product.errors";
import { StorageService } from "../infra/storage/storage.service";
import { IProductImageRepository } from "./images/product-image.repository";
import { Product } from "./product";
import { IProductRepository } from "./product.repository";
import { CreateProductDTO, ListProductQuery, ProductImage, ProductResponseDTO, UpdateProductDTO, uploadProductImageInputSchema } from "./product.types";
import { randomUUID } from "crypto";

interface UploadProductImageInput {
    productId: string
    buffer: Buffer
    contentType: string
    extension: string
}

export class ProductService {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly imageRepository: IProductImageRepository,
        private readonly storage: StorageService
    ) {}

    async search(query: ListProductQuery): Promise<ProductResponseDTO[]> {
        const products = await this.productRepository.search(query);

        const productIds = products.map(p => p.id);

        const images = await this.imageRepository.findByProductIds(productIds);

        const imagesByProduct = new Map<string, ProductImage[]>();

        for (const img of images) {
            const list = imagesByProduct.get(img.productId) ?? [];
            list.push(img);
            imagesByProduct.set(img.productId, list);
        }

        return Promise.all(
            products.map(async product => {
                const productImages = imagesByProduct.get(product.id) ?? [];

                const imagesDTO = await Promise.all(
                    productImages.map(img => this.toImageDTO(img))
                );

                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    sku: product.sku,
                    description: product.description,
                    images: imagesDTO,
                    thumbnailUrl: imagesDTO[0]?.url ?? null,
                };
            })
        );
    }

    async create(dto: CreateProductDTO): Promise<Product> {      
        const existSku = await this.productRepository.existsBySku(dto.sku);

        if (existSku) {
            throw new SkuAlreadyExistsError();
        }  

        const product = new Product(
            randomUUID(),
            dto.name,
            dto.price,
            dto.sku,
            true,
            dto.description
        );

        return this.productRepository.create(product);
    }

    async show(productId: string): Promise<ProductResponseDTO> {
        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ProductNotFoundError();
        }

        const images = await this.imageRepository.findByProductId(productId);

        const imagesDTO = await Promise.all(
            images.map(img => this.toImageDTO(img))
        );

        return {
            id: product.id,
            name: product.name,
            price: product.price,
            sku: product.sku,
            description: product.description,
            images: imagesDTO,
            thumbnailUrl: imagesDTO[0]?.url ?? null,
        };
    }

    async remove(id: string): Promise<void> {
        await this.show(id);
        await this.productRepository.remove(id);
    }

    async update(id: string, data: UpdateProductDTO): Promise<Product> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw new ProductNotFoundError();
        }

        const updated = product.update(data);
        const result = await this.productRepository.update(updated);

        if (!result) {
            throw new ProductUpdateFailedError();
        }

        return result;
    }

    async uploadImage(input: UploadProductImageInput) {
        const { productId, extension, buffer, contentType } = uploadProductImageInputSchema.parse(input);

        const product = await this.productRepository.findById(productId);

        if (!product) {
            throw new ProductNotFoundError();
        }

        const imageId = randomUUID();
        const storageKey = `products/${productId}/${imageId}.${extension}`;

        // upload para o s3
        await this.storage.upload(
            storageKey,
            buffer,
            contentType
        );

        // salva a key do arquivo no banco
        const image = await this.imageRepository.create(
            productId,
            storageKey,
            contentType,
        );

        return this.toImageDTO(image);
    }

    private async toImageDTO(image: ProductImage) {
        const url = await this.storage.getSignedReadUrl(
            image.storageKey,
            image.contentType
        );

        return {
            id: image.id,
            url,
            createdAt: image.createdAt,
        };
    }

    async listImages(productId: string) {
        const images = await this.imageRepository.findByProductId(productId);

        return Promise.all(images.map(image => this.toImageDTO(image)));
    }

    async deleteImage(productId: string, imageId: string): Promise<void> {
        const image = await this.imageRepository.findById(imageId);

        if (!image) {
            throw new ProductImageNotFoundError();
        }

        if (image.productId !== productId) {
            throw new ProductImageUnauthorizedError();
        }

        // deletar do banco
        await this.imageRepository.deleteById(imageId);

        // deletar do s3
        await this.storage.delete(image.storageKey);
    }
}