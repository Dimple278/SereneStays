import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),

  providerId: Joi.string().optional(),
  provider: Joi.string().optional(),
  image: Joi.object({
    url: Joi.string().uri().optional(),
    filename: Joi.string().optional(),
  }).optional(),
}).options({ stripUnknown: true });

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email",
  }),
  fName: Joi.string().optional(),
  lName: Joi.string().optional(),
  providerId: Joi.string().optional(),
  provider: Joi.string().optional(),
  image: Joi.object({
    url: Joi.string().uri().optional(),
    filename: Joi.string().optional(),
  }).optional(),
}).options({ stripUnknown: true });

export const userIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
