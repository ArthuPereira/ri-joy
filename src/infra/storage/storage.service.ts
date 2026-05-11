import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface StorageService {
    upload(key: string, buffer: Buffer, contentType: string): Promise<string>;
    getSignedReadUrl(key: string, contentType: string): Promise<string>;
    delete(key: string): Promise<string>;
}

export class S3StorageService implements StorageService {
    private readonly bucket: string;

    constructor(bucket = process.env.S3_BUCKET!) {
        if (!bucket) {
            throw new Error("S3_BUCKET não definido");
        }

        this.bucket = bucket;
    }

    async upload(key: string, buffer: Buffer, contentType: string): Promise<string> {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            })
        );

        return key;
    }

    async getSignedReadUrl(key: string, contentType: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ResponseContentType: contentType,
        });

        return getSignedUrl(s3Client, command, {
            expiresIn: 60 * 5, // 5 minutos
        });
    }

    async delete(key: string): Promise<string> {
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            })
        );

        return key;
    }
}