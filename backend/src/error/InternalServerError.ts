import { BaseError } from "./BaseError";
import HTTP from "http-status-codes";

export class InternalServerError extends BaseError {
  constructor(message = "Internal Server Error") {
    super(message, HTTP.INTERNAL_SERVER_ERROR);
  }
}
