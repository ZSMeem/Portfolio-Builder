import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';

// PUT /api/sections/[sectionId] - Update a section
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
    const { sectionId } = params;
    const body = await request.json();

    const existingSection = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        portfolio: true
      }
    });

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    if (existingSection.portfolio.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { type, title, content, order, isVisible } = body;
    const updateData = {};

    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (order !== undefined) updateData.order = order;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    const section = await prisma.section.update({
      where: { id: sectionId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Section updated successfully',
      section
    });

  } catch (error) {
    console.error('Update section error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/sections/[sectionId] - Delete a section
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
    const { sectionId } = params;

    const existingSection = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        portfolio: true
      }
    });

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    if (existingSection.portfolio.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.section.delete({
      where: { id: sectionId }
    });

    return NextResponse.json({
      message: 'Section deleted successfully'
    });

  } catch (error) {
    console.error('Delete section error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
