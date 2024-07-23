import config from "../config";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { IUser } from "../interface/user";
import { Request } from "../interface/auth.interface";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../error/Error";

// Middleware to authenticate user
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    const error = new UnauthorizedError("Unauthorized");
    next(error);
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    const error = new BadRequestError("Invalid token");
    next(error);
    return;
  }

  try {
    const user = (await verify(token[1], config.jwt.secret!)) as IUser;

    req.user = user;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        const customError = new UnauthorizedError("Token has expired");
        next(customError);
        return;
      } else if (error.name === "JsonWebTokenError") {
        const customError = new BadRequestError("Invalid token");
        next(customError);
        return;
      }
    }
    const unknownError = new InternalServerError("Could not authenticate");
    next(unknownError);
  }
  next();
}
