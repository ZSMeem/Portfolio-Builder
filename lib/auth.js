/*This is a sample too*/

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticate(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  // Get user from database
  const { query } = await import('./db.js');
  const users = await query(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [decoded.userId]
  );

  return users.length > 0 ? users[0] : null;
}