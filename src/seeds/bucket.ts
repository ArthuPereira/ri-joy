import { CreateBucketCommand, DeleteBucketCommand, HeadBucketCommand, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "../infra/storage/storage";

export async function createBucket(bucket: string) {
    try {
        await s3Client.send(
            new HeadBucketCommand({ Bucket: bucket })
        );
        return;
    } catch {
        await s3Client.send(
            new CreateBucketCommand({ Bucket: bucket })
        );
    }
}

export async function listBuckets() {
    const result = await s3Client.send(
        new ListBucketsCommand({})
    );

    return result.Buckets?.map(b => b.Name!).filter(Boolean) ?? [];
}

export async function listBucketItems(bucket: string, prefix?: string) {
    const result = await s3Client.send(
        new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix, // ex: "products/"
        })
    );

    return (
        result.Contents?.map((item) => ({
            key: item.Key!,
            size: item.Size,
            lastModified: item.LastModified,
            etag: item.ETag,
        })) ?? []
    );
}

export async function deleteBucket(bucket: string) {
    await s3Client.send(
        new DeleteBucketCommand({ Bucket: bucket })
    );
}