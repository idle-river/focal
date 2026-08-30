import { S3Client } from "bun";

interface S3Options {
    accessKeyId: string
    secretAccessKey: string
    bucket: string
    endpoint: string
}

class S3 {
    private client: S3Client;

    constructor(options: S3Options) {
        this.client = new S3Client(options);
    }

    async upload(key: string, body: File) {
        return await this.client.write(key, body);
    }

    async get(key: string) {
        return await this.client.file(key);
    }

    async delete(key: string) {
        return await this.client.delete(key);
    }

    async presignedUrl(key: string, expiresIn: number = 3600) {
        return await this.client.presign(key, { expiresIn });
    }
}

export const s3 = new S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    bucket: process.env.S3_BUCKET!,
    endpoint: process.env.S3_ENDPOINT!,
});