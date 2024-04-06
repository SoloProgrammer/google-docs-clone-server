import { NextFunction, Request, Response } from "express";
import CustomError from "../lib/CustomError.js";

export const ErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode ||= 500;
  err.message ||= "Internal server error";

  res.status(err.statusCode).json({
    message: err.message,
    success: false,
  });
};
