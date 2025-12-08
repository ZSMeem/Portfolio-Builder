// import { authenticate } from '@/lib/auth';
import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';
export async function GET(request) {
  const user = await authenticate(request);

  if (!user) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  return Response.json({ user });
}