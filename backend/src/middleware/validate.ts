import { Request, Response, NextFunction } from "express";
import {
  createListingSchema,
  updateListingSchema,
  listingIdSchema,
  querySchema,
} from "../schemas/listing";

export const validateCreateListing = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createListingSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export const validateUpdateListing = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateListingSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export const validateListingId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = listingIdSchema.validate(req.params);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export const validateQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = querySchema.validate(req.query);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};
