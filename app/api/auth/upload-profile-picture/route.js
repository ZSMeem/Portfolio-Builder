import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';

export async function POST(request) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Image data is required' },
                { status: 400 }
            );
        }

        // Validate base64 image
        if (!image.startsWith('data:image/')) {
            return NextResponse.json(
                { error: 'Invalid image format' },
                { status: 400 }
            );
        }

        // Update user with profile picture
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { profilePicture: image },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profilePicture: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            message: 'Profile picture uploaded successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Upload profile picture error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Remove profile picture
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { profilePicture: null },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                profilePicture: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            message: 'Profile picture removed successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Remove profile picture error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}