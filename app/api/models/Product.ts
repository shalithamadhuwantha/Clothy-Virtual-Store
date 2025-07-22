import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  seller: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String },
  stock: { type: Number, default: 0 },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default models.Product || mongoose.model<IProduct>('Product', ProductSchema); 