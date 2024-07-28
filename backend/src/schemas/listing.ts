import Joi from "joi";

// Define the schema for creating a new listing
export const createListingSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.base": "Title must be a string",
  }),
  description: Joi.string().required().messages({
    "any.required": "Description is required",
    "string.base": "Description must be a string",
  }),
  country: Joi.string().required().messages({
    "any.required": "Country is required",
    "string.base": "Country must be a string",
  }),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
    "string.base": "Location must be a string",
  }),
  price: Joi.number().required().min(0).messages({
    "any.required": "Price is required",
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 0",
  }),
  image: Joi.string().allow("", null).messages({
    "string.base": "Image must be a string",
  }),
  category: Joi.string().optional().messages({
    "string.base": "Category must be a string",
  }),
}).options({ stripUnknown: true });

// Define the schema for updating a listing
export const updateListingSchema = Joi.object({
  title: Joi.string().optional().messages({
    "string.base": "Title must be a string",
  }),
  description: Joi.string().optional().messages({
    "string.base": "Description must be a string",
  }),
  country: Joi.string().optional().messages({
    "string.base": "Country must be a string",
  }),
  location: Joi.string().optional().messages({
    "string.base": "Location must be a string",
  }),
  price: Joi.number().optional().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 0",
  }),
  image: Joi.string().allow("", null).optional().messages({
    "string.base": "Image must be a string",
  }),
  category: Joi.string().optional().messages({
    "string.base": "Category must be a string",
  }),
}).options({ stripUnknown: true });

// Define the schema for listing ID
export const listingIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "ID must be a number",
    "any.required": "ID is required",
  }),
}).options({ stripUnknown: true });

// Define the schema for query parameters
export const querySchema = Joi.object({
  category: Joi.string().optional().messages({
    "string.base": "Category must be a string",
  }),
  minPrice: Joi.number().optional().min(0).messages({
    "number.base": "Minimum price must be a number",
    "number.min": "Minimum price must be at least 0",
  }),
  maxPrice: Joi.number().optional().min(0).messages({
    "number.base": "Maximum price must be a number",
    "number.min": "Maximum price must be at least 0",
  }),
  sort: Joi.string().valid("asc", "desc").optional().messages({
    "string.base": "Sort must be a string",
    "any.only": "Sort must be one of asc, desc",
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
  }),
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
}).options({ stripUnknown: true });
