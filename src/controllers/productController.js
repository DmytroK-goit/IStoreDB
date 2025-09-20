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
export const updateItem = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const { name, price, description, category, quantity } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price && !isNaN(Number(price))) updateData.price = Number(price);
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (quantity && !isNaN(Number(quantity)))
      updateData.quantity = Number(quantity);

    if (req.file) {
      updateData.img = await uploadToCloudinary(req.file);
    }

    const updatedProduct = await ItemsCollection.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

function uploadToCloudinary(file) {
  return new Promise((res, rej) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) return rej(error);
        res(result.secure_url);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}
export const deleteItem = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const { id } = req.params;
    const deletedProduct = await ItemsCollection.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted', deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
