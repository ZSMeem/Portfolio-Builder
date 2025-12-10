import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Projects retrieved successfully',
      data: [
        { id: 1, title: 'Demo Project 1', technologies: ['React', 'Node.js'] },
        { id: 2, title: 'Demo Project 2', technologies: ['Next.js'] }
      ]
    })
  } catch (error) {
    console.error('Projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: 'Project created successfully',
      project: { id: Date.now(), ...body }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
