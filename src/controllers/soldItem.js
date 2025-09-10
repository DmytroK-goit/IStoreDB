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
      const product = await ItemsCollection.findById(item.productId);
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

      product.quantity -= item.quantity;
      await product.save();

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
