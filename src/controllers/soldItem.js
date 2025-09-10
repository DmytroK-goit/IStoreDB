import { OrderCollection } from '../db/models/soldItem.js';
import { ItemsCollection } from '../db/models/items.js';

export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    const order = await OrderCollection.findOne({ userId, status: 'creating' });
    if (!order || order.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const updatedItems = [];
    for (const item of order.items) {
      const product = await ItemsCollection.findById(item._id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }
      if (item.quantity > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${product.name}. Available: ${product.quantity}`,
        });
      }

      updatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    order.items = updatedItems;
    order.total = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    order.address = address;
    order.status = 'processing';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
