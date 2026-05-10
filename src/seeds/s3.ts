import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../infra/storage/storage";
import fs from "fs";
import path from "path";

const BUCKET = process.env.S3_BUCKET!;

async function seed() {
    const key = `${BUCKET}/seed/foto.jpg`;

    const filePath = path.join(
        process.cwd(),
        "src",
        "seeds",
        "assets",
        "" // nome do arquivo, não esquecer
    );

    await s3Client.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: fs.readFileSync(filePath),
            ContentType: "image/jpeg",
        })
    );
}