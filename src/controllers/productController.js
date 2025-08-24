import { ItemsSchema } from '../db/models/items';

export const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const product = await ItemsSchema.create({ name, price, category });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
