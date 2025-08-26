import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { ItemsCollection } from '../db/models/items.js';

export const addItem = async ({
  name,
  price,
  category,
  description,
  quantity,
  date,
  img,
}) => {
  const existingItem = await ItemsCollection.findOne({ name });

  if (existingItem) {
    throw createHttpError(409, 'Item already exists');
  }

  return await ItemsCollection.create({
    name,
    price,
    category,
    description,
    quantity,
    date,
    img,
  });
};

export const addToCart = async (userId, itemId, quantity = 1) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const existingItem = user.cart.find(
    (cartItem) => cartItem.item.toString() === itemId,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ item: itemId, quantity });
  }

  await user.save();
  return user.cart;
};
