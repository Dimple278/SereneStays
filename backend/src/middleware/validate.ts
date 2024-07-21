import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Higher-order function to validate the request body
export const validateBody = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
};

// Higher-order function to validate the request params
export const validateParams = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
};

// Higher-order function to validate the request query
export const validateQuery = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  };
};
