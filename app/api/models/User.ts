import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  name: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  name: { type: String, required: true },
});

export default models.User || mongoose.model<IUser>('User', UserSchema); 