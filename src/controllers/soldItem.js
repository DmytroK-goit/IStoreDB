import { OrderCollection } from '../db/models/soldItem.js';
import { CartCollection } from '../db/models/cart.js';

export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    const cart = await CartCollection.findOne({ userId }).populate(
      'items.productId',
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = await OrderCollection.create({
      userId,
      items: cart.items.map((i) => ({
        productId: i.productId._id,
        name: i.productId.name,
        price: i.productId.price,
        quantity: i.quantity,
      })),
      address,
      total: cart.items.reduce(
        (sum, i) => sum + i.productId.price * i.quantity,
        0,
      ),
      status: 'creating',
      createdAt: new Date(),
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const getOrderProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await OrderCollection.find({ userId }).populate(
      'items.productId',
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderCollection.find()
      .populate('userId', 'email name')
      .populate('items.productId', 'name price');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
