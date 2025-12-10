import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';

// GET /api/projects/[projectId] - Get a single project
export async function GET(request, context) {
  try {
    const params = await context.params;
    const { projectId } = params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        portfolio: {
          select: {
            id: true,
            title: true,
            slug: true,
            user: {
              select: {
                name: true,
                username: true,
              }
            }
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });

  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[projectId] - Update a project
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
    const { projectId } = params;
    const body = await request.json();

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        portfolio: true
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (existingProject.portfolio.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

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
    
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (technologies !== undefined) updateData.technologies = technologies;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (images !== undefined) updateData.images = images;
    if (order !== undefined) updateData.order = order;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId] - Delete a project
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
    const { projectId } = params;

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        portfolio: true
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (existingProject.portfolio.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
