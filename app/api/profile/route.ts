import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_db';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'chanuqwirquiuqwqyurqwerwtgretertgeme';

export async function GET(req: NextRequest) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const body = await req.json();
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    Object.assign(user, body);
    await user.save();
    return NextResponse.json({ message: 'Profile updated' });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 