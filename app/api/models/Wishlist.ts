import mongoose, { Schema, Document, models } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export default models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema); 