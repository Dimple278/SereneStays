class ExpressError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default ExpressError;
