import { CartCollection } from '../db/models/cart.js';

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { _id, quantity } = req.body;
  let cart = await CartCollection.findOne({ userId });

  if (!cart) {
    cart = await CartCollection.create({ userId, items: [{ _id, quantity }] });
  } else {
    const existingItem = cart.items.find((item) => item._id.toString() === _id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ _id, quantity });
    }
    await cart.save();
  }
  res.status(200).json(cart);
};
export const getCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await CartCollection.findOne({ userId }).populate('items._id');
  res.json(cart || { items: [] });
};

export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { _id } = req.params;

  const cart = await CartCollection.findOne({ userId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  cart.items = cart.items.filter((item) => item._id.toString() !== _id);
  await cart.save();
  res.json(cart);
};
