import Joi from 'joi';

export const createSoldProductSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  category: Joi.string()
    .valid('Auto', 'Food', 'Health', 'Transport', 'Education')
    .required()
    .messages({
      'any.only':
        'Category must be one of: Auto, Food, Health, Transport, Education',
      'any.required': 'Category is required',
    }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
  description: Joi.string().max(500).required().messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description must not exceed 500 characters',
    'any.required': 'Description is required',
  }),
  date: Joi.date().iso().messages({
    'date.base': 'Date must be a valid date',
    'date.format': 'Date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)',
    'any.required': 'Date is required',
  }),
  img: Joi.string().uri().messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URL',
    'any.required': 'Image is required',
  }),
});

export const updateSoldProductSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string()
    .valid('Auto', 'Food', 'Health', 'Transport', 'Education')
    .optional(),
  quantity: Joi.number().integer().min(1).optional(),
  date: Joi.date().iso().optional(),
  img: Joi.string().uri().optional(),
});
