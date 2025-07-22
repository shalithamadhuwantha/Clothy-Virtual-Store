import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_db';
import Product from '../models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'chanuqwirquiuqwqyurqwerwtgretertgeme';

export async function GET() {
  await dbConnect();
  const products = await Product.find().populate('seller', 'name email');
  return NextResponse.json(products);
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
    if (payload.role !== 'seller') {
      return NextResponse.json({ error: 'Only sellers can create products' }, { status: 403 });
    }
    const body = await req.json();
    const product = await Product.create({ ...body, seller: payload.userId });
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 