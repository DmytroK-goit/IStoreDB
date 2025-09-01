import { Schema, model } from 'mongoose';

const itemsSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Auto', 'Food', 'Health', 'Transport', 'Education', 'Electronics'],
    required: true,
  },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  img: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

export const ItemsCollection = model('items', itemsSchema);
