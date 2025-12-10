import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import { authenticate } from '@/lib/auth';
import { prisma } from '../../../lib/db.js';
import { authenticate } from '../../../lib/auth.js';
// GET /api/portfolios - Get all portfolios for the authenticated user
export async function GET(request) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Get portfolios with counts
        const [portfolios, total] = await Promise.all([
            prisma.portfolio.findMany({
                where: { userId: user.id },
                include: {
                    _count: {
                        select: {
                            projects: true,
                            sections: true,
                        }
                    }
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.portfolio.count({
                where: { userId: user.id }
            })
        ]);

        return NextResponse.json({
            portfolios,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error('Get portfolios error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/portfolios - Create a new portfolio
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
        const { title, description, theme } = body;

        // Validation
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        // Generate unique slug
        const baseSlug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();

        let slug = baseSlug;
        let counter = 1;
        let slugExists = true;

        while (slugExists) {
            const existing = await prisma.portfolio.findUnique({
                where: { slug }
            });

            if (!existing) {
                slugExists = false;
            } else {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        // Create portfolio
        const portfolio = await prisma.portfolio.create({
            data: {
                userId: user.id,
                title,
                description: description || null,
                slug,
                theme: theme || 'default',
            },
            include: {
                _count: {
                    select: {
                        projects: true,
                        sections: true,
                    }
                }
            }
        });

        return NextResponse.json(
            {
                message: 'Portfolio created successfully',
                portfolio
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Create portfolio error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}