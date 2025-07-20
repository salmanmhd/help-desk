class ErrorResponse {
  constructor(statusCode, error = { code: "", message: "" }) {
    this.statusCode = statusCode;
    this.success = statusCode < 300;
    this.error = error;
  }
}

export { ErrorResponse };
