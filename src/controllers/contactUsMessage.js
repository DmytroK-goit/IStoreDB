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
export const delContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await ContactUsCollection.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
