import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../_db';
import Product from '../../models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_here';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const product = await Product.findById(params.id).populate('seller', 'name email');
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (product.seller.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    Object.assign(product, body);
    await product.save();
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (product.seller.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await product.deleteOne();
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 