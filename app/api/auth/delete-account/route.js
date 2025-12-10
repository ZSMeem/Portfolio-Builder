import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';
import { authenticate, verifyPassword } from '../../../../lib/auth.js';

export async function DELETE(request) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required to delete account' },
                { status: 400 }
            );
        }

        // Get user with password hash
        const userWithPassword = await prisma.user.findUnique({
            where: { id: user.id }
        });

        // Verify password
        const isValidPassword = await verifyPassword(password, userWithPassword.passwordHash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 400 }
            );
        }

        // Delete user (cascade will delete portfolios, sections, projects, assets)
        await prisma.user.delete({
            where: { id: user.id }
        });

        return NextResponse.json({
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
