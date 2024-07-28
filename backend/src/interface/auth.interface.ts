import { Request as ExpressRequest } from "express";
import { IUser } from "./user";

export interface Params {
  id: string;
}

export interface AuthRequest<
  // P = Params, // Default Params type with id as number
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
> extends ExpressRequest<ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}
