import { Request, Response, NextFunction } from "express";

/**
 * Wraps an asynchronous Express route handler to handle errors.
 * This function takes an async route handler and returns a new function
 * that automatically passes any errors to the next middleware in the Express
 * pipeline by calling `next` with the error.
 *
 * @param {Function} fn - The asynchronous route handler function to wrap.
 * @returns {Function} A new function that handles the request, response, and next middleware,
 *                      and catches any errors thrown by the original async handler.
 */
export const wrapAsync = (fn: Function) => {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
};
