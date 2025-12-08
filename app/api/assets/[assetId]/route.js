import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import { authenticate } from '@/lib/auth';
// import { deleteFromS3 } from '@/lib/s3';

import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';
import { deleteFromS3 } from '../../../../lib/s3.js';


// DELETE /api/assets/[assetId] - Delete an asset
export async function DELETE(request, { params }) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { assetId } = params;

        // Get asset
        const asset = await prisma.asset.findUnique({
            where: { id: assetId }
        });

        if (!asset) {
            return NextResponse.json(
                { error: 'Asset not found' },
                { status: 404 }
            );
        }

        // Check ownership
        if (asset.userId !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Delete from S3
        try {
            await deleteFromS3(asset.url);
        } catch (s3Error) {
            console.error('S3 deletion error:', s3Error);
            // Continue even if S3 deletion fails
        }

        // Delete from database
        await prisma.asset.delete({
            where: { id: assetId }
        });

        return NextResponse.json({
            message: 'Asset deleted successfully'
        });

    } catch (error) {
        console.error('Delete asset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}