import { ItemsCollection } from '../db/models/items.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, quantity, img } = req.body;
    const product = await ItemsCollection.create({
      name,
      price,
      category,
      quantity,
      img,
      userId: req.user._id,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await ItemsCollection.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const getProductToCart = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await ItemsCollection.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//   }
