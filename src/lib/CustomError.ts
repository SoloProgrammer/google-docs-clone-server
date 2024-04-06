class CustomError extends Error {
  statusCode: number;
  constructor(public message: string, public status: number) {
    super(message);
    this.statusCode = status;
  }
}

export default CustomError;
