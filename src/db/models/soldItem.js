import { Schema, model } from 'mongoose';

const soldItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'items', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  address: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    house: { type: String, required: true },
    apartment: { type: String },
    comment: { type: String },
  },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['creating', 'processing', 'shipped', 'delivered'],
    default: 'creating',
  },
  trackingNumber: { type: String, default: null },
  items: [soldItemSchema],
  createdAt: { type: Date, default: Date.now },
});

export const OrderCollection = model('Order', orderSchema);
