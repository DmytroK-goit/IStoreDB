import Joi from 'joi';

// === User Schemas ===
export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string(),
  role: Joi.string().valid('admin', 'user').default('user'), // дефолт юзер
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  role: Joi.string().valid('admin', 'user'),
});

// === Address Schema ===
export const addressSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  house: Joi.string().required(),
  apartment: Joi.string().required(),
  comment: Joi.string().optional(),
});

// === SoldOrder Schema ===
export const soldOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
        date: Joi.string().isoDate().required(),
      }),
    )
    .min(1)
    .required(),
  address: addressSchema.required(),
  total: Joi.number().required(),
});
