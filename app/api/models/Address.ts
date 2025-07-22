import mongoose, { Schema, Document, models } from 'mongoose';

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

export default models.Address || mongoose.model<IAddress>('Address', AddressSchema); 