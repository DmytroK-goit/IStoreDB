import { ContactUsCollection } from '../db/models/contactUsMessage.js';

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = await ContactUsCollection.create({
      name,
      email,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getContactMessages = async (req, res) => {
  try {
    const contactUs = await ContactUsCollection.find();
    res.status(200).json(contactUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
