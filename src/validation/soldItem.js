import Joi from 'joi';

export const orderValidationSchema = Joi.object({
  address: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^\+?[0-9\s()-]{10,20}$/)
      .required()
      .messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base':
          'Phone number must be valid (e.g. +38(097)9638775)',
      }),
    city: Joi.string().min(2).max(100).required(),
    street: Joi.string().min(2).max(100).required(),
    house: Joi.string().min(1).max(10).required(),
    apartment: Joi.string().max(10).allow('', null),
    comment: Joi.string().max(500).allow('', null),
  }).required(),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});
