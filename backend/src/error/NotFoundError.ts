import { BaseError } from "./BaseError";
import HTTP from "http-status-codes";

export class NotFoundError extends BaseError {
  constructor(message = "Not Found") {
    super(message, HTTP.NOT_FOUND);
  }
}
