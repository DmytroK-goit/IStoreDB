import Joi from 'joi';

export const createSoldProductSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    'number.base': 'ID must be a number',
    'number.integer': 'ID must be an integer',
    'number.min': 'ID must be greater than 0',
    'any.required': 'ID is required',
  }),
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
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in the format YYYY-MM-DDTHH:mm',
      'any.required': 'Date is required',
    }),
});

export const updateSoldProductSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  price: Joi.number().min(0).optional(),
  quantity: Joi.number().integer().min(1).optional(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .optional(),
});
