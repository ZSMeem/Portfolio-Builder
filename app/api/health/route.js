// app/api/health/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'OK',
    message: 'Portfolio Builder API is running',
    timestamp: new Date().toISOString()
  })
}