import Joi from "joi";

export const createBookingSchema = Joi.object({
  start_date: Joi.date().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required",
  }),
  end_date: Joi.date().greater(Joi.ref("start_date")).required().messages({
    "date.base": "End date must be a valid date",
    "date.greater": "End date must be greater than the start date",
    "any.required": "End date is required",
  }),
}).options({ stripUnknown: true });

export const updateBookingSchema = Joi.object({
  user_id: Joi.number().optional().messages({
    "number.base": "User ID must be a number",
  }),
  listing_id: Joi.number().optional().messages({
    "number.base": "Listing ID must be a number",
  }),
  start_date: Joi.date().optional().messages({
    "date.base": "Start date must be a valid date",
  }),
  end_date: Joi.date().greater(Joi.ref("start_date")).optional().messages({
    "date.base": "End date must be a valid date",
    "date.greater": "End date must be greater than the start date",
  }),
  total_price: Joi.number().precision(2).optional().messages({
    "number.base": "Total price must be a number",
  }),
}).options({ stripUnknown: true });

export const bookingIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
