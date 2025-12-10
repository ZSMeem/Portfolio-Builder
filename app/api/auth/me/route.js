import { prisma } from '../../../../lib/db.js';
import { authenticate } from '../../../../lib/auth.js';

export async function GET(request) {
  const authUser = await authenticate(request);
  
  if (!authUser) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Fetch full user data including profile picture
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      profilePicture: true,  // Make sure this is included
      createdAt: true,
    }
  });
  
  return Response.json({ user });
}
