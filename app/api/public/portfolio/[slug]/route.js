import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db.js';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    console.log('=== PUBLIC PORTFOLIO API ===');
    console.log('Slug requested:', slug);

    const portfolio = await prisma.portfolio.findFirst({
      where: { 
        slug: slug,
        isPublished: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          }
        },
        sections: {
          orderBy: { order: 'asc' },
        },
        projects: {
          orderBy: { order: 'asc' },
        },
      },
    });

    console.log('Portfolio found:', !!portfolio);

    if (!portfolio) {
      console.log('No portfolio found with slug:', slug);
      return NextResponse.json(
        { error: 'Portfolio not found or not published' },
        { status: 404 }
      );
    }

    console.log('Returning portfolio:', portfolio.title);
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
