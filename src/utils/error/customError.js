class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = "CustomError";
  }
}

export default CustomError;
