import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';

// GET /api/portfolios/[id] - Get a single portfolio
export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' }
        },
        projects: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            name: true,
            username: true,
          }
        }
      }
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    if (!portfolio.isPublished) {
      const user = await authenticate(request);
      
      if (!user || user.id !== portfolio.userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ portfolio });

  } catch (error) {
    console.error('Get portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/portfolios/[id] - Update a portfolio
export async function PUT(request, context) {
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

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    if (existingPortfolio.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { title, description, theme, isPublished } = body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (theme !== undefined) updateData.theme = theme;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            projects: true,
            sections: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Portfolio updated successfully',
      portfolio
    });

  } catch (error) {
    console.error('Update portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolios/[id] - Delete a portfolio
export async function DELETE(request, context) {
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

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id }
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    if (existingPortfolio.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.portfolio.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Portfolio deleted successfully'
    });

  } catch (error) {
    console.error('Delete portfolio error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
