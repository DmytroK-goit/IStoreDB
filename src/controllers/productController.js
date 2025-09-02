import { ItemsCollection } from '../db/models/items.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity } = req.body;

    if (!name || !price || !category || !quantity) {
      return res.status(400).json({
        message: 'Name, price, category, and quantity are required',
      });
    }

    let imageUrl = null;

    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error)
            return res.status(500).json({ message: 'Cloudinary error', error });
          imageUrl = result.secure_url;

          saveProduct();
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      saveProduct();
    }

    async function saveProduct() {
      const newProduct = {
        name,
        price: Number(price),
        description: description || '',
        category,
        quantity: Number(quantity),
        img: imageUrl,
        userId: req.user._id,
      };

      const saved = await ItemsCollection.create(newProduct);
      return res.status(201).json(saved);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to create product',
      error: error.message,
    });
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
