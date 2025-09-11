import { OrderCollection } from '../db/models/soldItem.js';
import { CartCollection } from '../db/models/cart.js';
import { ItemsCollection } from '../db/models/items.js';

export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    const cart = await CartCollection.findOne({ userId }).populate('items._id');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [];

    for (const i of cart.items) {
      const product = await ItemsCollection.findById(i.productId._id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${i.productId._id} not found` });
      }

      if (i.quantity > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${product.name}. Available: ${product.quantity}`,
        });
      }

      product.quantity -= i.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
      });
    }

    const order = await OrderCollection.create({
      userId,
      items: orderItems,
      address,
      total: orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      status: 'processing',
      createdAt: new Date(),
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('createOrderFromCart error:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const order = await OrderCollection.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedStatuses = ['creating', 'processing', 'shipped', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
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
