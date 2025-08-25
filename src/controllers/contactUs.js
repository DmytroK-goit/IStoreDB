import { ContactUs } from '../db/models/contactUs.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = await ContactUs.create({
      name,
      email,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
