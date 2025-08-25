import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: String, required: true },
  apartment: { type: String },
  comment: { type: String },
});

export const Address = model('Address', addressSchema);

const soldItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
});

export const SoldItem = model('SoldItem', soldItemSchema);
