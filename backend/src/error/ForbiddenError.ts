import { BaseError } from "./BaseError";
import HTTP from "http-status-codes";

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, HTTP.FORBIDDEN);
  }
}
