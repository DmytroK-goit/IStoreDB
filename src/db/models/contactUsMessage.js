import { Schema, model } from 'mongoose';

const contactUsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const ContactUsCollection = model('ContactUs', contactUsSchema);
