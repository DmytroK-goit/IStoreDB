import Joi from 'joi';

export const orderValidationSchema = Joi.object({
  address: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required(),
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
