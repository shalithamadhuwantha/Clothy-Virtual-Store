import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../_db';
import Wishlist from '../models/Wishlist';
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
    if (payload.role !== 'buyer') {
      return NextResponse.json({ error: 'Only buyers have wishlists' }, { status: 403 });
    }
    let wishlist = await Wishlist.findOne({ user: payload.userId }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: payload.userId, products: [] });
    return NextResponse.json(wishlist);
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
      return NextResponse.json({ error: 'Only buyers have wishlists' }, { status: 403 });
    }
    const { productId } = await req.json();
    let wishlist = await Wishlist.findOne({ user: payload.userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: payload.userId, products: [] });
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    return NextResponse.json(wishlist);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.role !== 'buyer') {
      return NextResponse.json({ error: 'Only buyers have wishlists' }, { status: 403 });
    }
    const { productId } = await req.json();
    let wishlist = await Wishlist.findOne({ user: payload.userId });
    if (wishlist && wishlist.products.includes(productId)) {
      wishlist.products = wishlist.products.filter((id: any) => id.toString() !== productId);
      await wishlist.save();
    }
    return NextResponse.json(wishlist);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token or request' }, { status: 401 });
  }
} 