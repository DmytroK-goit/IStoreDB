import { ItemsCollection } from '../db/models/items.js';

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity } = req.body;
    const image = req.file;

    if (!name || !price || !category || !quantity) {
      return res
        .status(400)
        .json({ message: 'Name, price, category, and quantity are required' });
    }

    const newProduct = {
      name,
      price: Number(price),
      description: description || '',
      category,
      quantity: Number(quantity),
      image: image ? image.path || image.buffer : null,
    };

    const saved = await ItemsCollection.create(newProduct);

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to create product', error: error.message });
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
