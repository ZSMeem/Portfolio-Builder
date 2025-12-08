import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db.js';
import { authenticate } from '../../../../../lib/auth.js';

// GET /api/portfolios/[id]/projects - Get all projects for a portfolio
export async function GET(request, context) {
    try {
        const params = await context.params;
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';

        const portfolio = await prisma.portfolio.findUnique({
            where: { id }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            );
        }

        let whereClause = { portfolioId: id };
        if (featured) {
            whereClause.isFeatured = true;
        }

        const projects = await prisma.project.findMany({
            where: whereClause,
            orderBy: [
                { isFeatured: 'desc' },
                { order: 'asc' }
            ]
        });

        return NextResponse.json({ projects });

    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/portfolios/[id]/projects - Create a new project
export async function POST(request, context) {
    try {
        const user = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const params = await context.params;
        const { id } = params;
        const body = await request.json();
        const {
            title,
            description,
            technologies,
            liveUrl,
            githubUrl,
            featuredImage,
            images,
            order,
            isFeatured
        } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const portfolio = await prisma.portfolio.findUnique({
            where: { id }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            );
        }

        if (portfolio.userId !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        let projectOrder = order;
        if (projectOrder === undefined) {
            const maxOrder = await prisma.project.findFirst({
                where: { portfolioId: id },
                orderBy: { order: 'desc' },
                select: { order: true }
            });
            projectOrder = (maxOrder?.order || 0) + 1;
        }

        const project = await prisma.project.create({
            data: {
                portfolioId: id,
                title,
                description: description || null,
                technologies: technologies || [],
                liveUrl: liveUrl || null,
                githubUrl: githubUrl || null,
                featuredImage: featuredImage || null,
                images: images || [],
                order: projectOrder,
                isFeatured: isFeatured || false,
            }
        });

        return NextResponse.json(
            {
                message: 'Project created successfully',
                project
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Create project error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
