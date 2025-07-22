import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_db';
import Address from '../models/Address';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_here';

export async function GET(req: NextRequest) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const addresses = await Address.find({ user: payload.userId });
    return NextResponse.json(addresses);
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
    const body = await req.json();
    const address = await Address.create({ ...body, user: payload.userId });
    return NextResponse.json(address, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 