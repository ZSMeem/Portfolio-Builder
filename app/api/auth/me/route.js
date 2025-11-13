import { authenticate } from '@/lib/auth';

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