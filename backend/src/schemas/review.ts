import Joi from "joi";

export const createReviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
}).options({ stripUnknown: true });

export const updateReviewSchema = Joi.object({
  comment: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).optional(),
}).options({ stripUnknown: true });

export const reviewIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
