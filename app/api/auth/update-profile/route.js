import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';

export async function PUT(request) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, username } = body;

        // Validation
        if (!name || !username) {
            return NextResponse.json(
                { error: 'Name and username are required' },
                { status: 400 }
            );
        }

        // Check if username is already taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser && existingUser.id !== user.id) {
            return NextResponse.json(
                { error: 'Username is already taken' },
                { status: 400 }
            );
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { name, username },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                createdAt: true,
            }
        });

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
