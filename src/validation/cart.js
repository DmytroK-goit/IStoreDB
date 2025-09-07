import Joi from 'joi';
import mongoose from 'mongoose';

const objIdValidation = (values, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(values)) {
    return helpers.message('"{{#label}}" must be a valid MongoDB ObjectId');
  }
  return values;
};

export const addToCartSchema = Joi.object({
  productId: Joi.string().custom(objIdValidation).required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const removeFromCartSchema = Joi.object({
  productId: Joi.string().custom(objIdValidation).required(),
});
