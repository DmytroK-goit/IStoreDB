import { ItemsSchema } from '../db/models/items';

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;
    const product = await ItemsSchema.create({
      name,
      price,
      category,
      quantity,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await ItemsSchema.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
