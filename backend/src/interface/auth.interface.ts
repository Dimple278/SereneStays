import { Request as ExpressRequest } from "express";
import { IUser } from "./user";

export interface Request<P = {}, ResBody = any, ReqBody = any, ReqQuery = {}>
  extends ExpressRequest<P, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}
