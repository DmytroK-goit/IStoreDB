import { CartCollection } from '../db/models/cart.js';

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    let cart = await CartCollection.findOne({ userId });
    if (!cart) {
      cart = await CartCollection.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
export const getCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await CartCollection.findOne({ userId }).populate('items._id');
  res.json(cart || { items: [] });
};

export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { cartItemId } = req.params;
  const cart = await CartCollection.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item._id.toString() !== cartItemId);

  if (cart.items.length === initialLength) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  await cart.save();
  res.json({ success: true });
};
