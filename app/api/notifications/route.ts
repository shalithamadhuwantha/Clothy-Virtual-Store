import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_db';
import Notification from '../models/Notification';
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
    const notifications = await Notification.find({ user: payload.userId }).sort({ createdAt: -1 });
    return NextResponse.json(notifications);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const { message } = await req.json();
    const notification = await Notification.create({ user: payload.userId, message });
    return NextResponse.json(notification, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 