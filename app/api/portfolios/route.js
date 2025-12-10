import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db.js';
import { authenticate } from '../../../lib/auth.js';

// POST /api/portfolios - Create a new portfolio
export async function POST(request) {
  console.log(' Portfolio creation request received');

  try {
    console.log(' Authenticating user...');
    const user = await authenticate(request);

    console.log('👤 User authenticated:', user ? user.id : 'null');

    if (!user) {
      console.log(' No user found - unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log(' Request body:', body);

    const { title, description, theme } = body;

    // Validation
    if (!title) {
      console.log(' Title is missing');
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    console.log('  Generating slug for:', title);

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

    console.log('Checking slug availability...');

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

    console.log(' Unique slug generated:', slug);
    console.log(' Creating portfolio in database...');

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

    console.log(' Portfolio created successfully:', portfolio.id);

    return NextResponse.json(
      {
        message: 'Portfolio created successfully',
        portfolio
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(' Create portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

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
