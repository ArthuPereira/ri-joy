import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../infra/storage/storage";
import fs from "fs";
import path from "path";
import { products } from "./db";
import { createBucket } from "./bucket";

const BUCKET = process.env.S3_BUCKET!;

export async function seedS3() {
    await createBucket(BUCKET);

    for (const product of products) {
        const filePath = path.join(
            process.cwd(),
            "src",
            "seeds",
            "assets",
            product.fileName
        );

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: product.imageKey,
                Body: fs.createReadStream(filePath),
                ContentType: "image/jpeg",
                ContentLength: fs.statSync(filePath).size,
                ChecksumAlgorithm: undefined,
            })
        );
    }
}