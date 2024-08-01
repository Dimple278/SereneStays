import { Request as ExpressRequest } from "express";
import { IUser } from "./user";

export interface Params {
  id: string;
}

export interface AuthRequest<ResBody = any, ReqBody = any, ReqQuery = {}>
  extends ExpressRequest<ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}
