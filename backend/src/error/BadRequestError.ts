import HTTP from "http-status-codes";
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message = "Bad Request") {
    super(message, HTTP.BAD_REQUEST);
  }
}
