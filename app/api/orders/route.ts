import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_db';
import Order from '../models/Order';
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
    let orders;
    if (payload.role === 'buyer') {
      orders = await Order.find({ buyer: payload.userId }).populate('products.product').populate('seller', 'name email');
    } else if (payload.role === 'seller') {
      orders = await Order.find({ seller: payload.userId }).populate('products.product').populate('buyer', 'name email');
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }
    return NextResponse.json(orders);
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
    if (payload.role !== 'buyer') {
      return NextResponse.json({ error: 'Only buyers can create orders' }, { status: 403 });
    }
    const body = await req.json();
    // body: { seller, products: [{product, quantity}], total, address }
    const order = await Order.create({ ...body, buyer: payload.userId });
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 