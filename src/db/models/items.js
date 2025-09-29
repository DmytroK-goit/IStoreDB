import { Schema, model } from 'mongoose';

const itemsSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      'Laptop',
      'Phone',
      'Accessories',
      'Power banks',
      'Monitors',
      'Electronics',
    ],
    required: true,
  },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  img: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

export const ItemsCollection = model('items', itemsSchema);
