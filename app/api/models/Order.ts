import mongoose, { Schema, Document, models } from 'mongoose';

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  products: Array<{ product: mongoose.Types.ObjectId; quantity: number }>;
  total: number;
  status: string;
  address: string;
}

const OrderSchema = new Schema<IOrder>({
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  address: { type: String, required: true },
}, { timestamps: true });

export default models.Order || mongoose.model<IOrder>('Order', OrderSchema); 