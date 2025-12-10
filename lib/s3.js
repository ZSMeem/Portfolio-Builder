import crypto from 'crypto';

// Check if S3 is configured
const isS3Configured = process.env.AWS_ACCESS_KEY_ID &&
                       process.env.AWS_SECRET_ACCESS_KEY &&
                       process.env.AWS_S3_BUCKET_NAME &&
                       process.env.AWS_REGION;

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Lazy-load AWS SDK only if needed
let S3Client, PutObjectCommand, DeleteObjectCommand, getSignedUrl;
let s3Client = null;

async function initS3() {
    if (!isS3Configured) {
        throw new Error('S3 is not configured. Please set AWS credentials in environment variables.');
    }

    if (!s3Client) {
        // Dynamically import AWS SDK only when needed
        const clientS3 = await import('@aws-sdk/client-s3');
        const presigner = await import('@aws-sdk/s3-request-presigner');

        S3Client = clientS3.S3Client;
        PutObjectCommand = clientS3.PutObjectCommand;
        DeleteObjectCommand = clientS3.DeleteObjectCommand;
        getSignedUrl = presigner.getSignedUrl;

        s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    return s3Client;
}

/**
 * Generate a unique filename
 */
function generateFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(file, folder = 'uploads') {
    const client = await initS3();

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = generateFilename(file.name);
    const key = `${folder}/${filename}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    });

    await client.send(command);

    // Return the public URL
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(fileUrl) {
    if (!isS3Configured) {
        console.warn('S3 is not configured. Skipping S3 deletion.');
        return;
    }

    const client = await initS3();

    // Extract the key from the URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await client.send(command);
}

/**
 * Generate a presigned URL for upload (client-side upload)
 */
export async function generatePresignedUrl(filename, contentType, folder = 'uploads') {
    const client = await initS3();

    const key = `${folder}/${generateFilename(filename)}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return {
        uploadUrl: signedUrl,
        fileUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key,
    };
}