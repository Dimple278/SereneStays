import { BaseError } from "./BaseError";
import HTTP from "http-status-codes";

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, HTTP.UNAUTHORIZED);
  }
}
