import { NextFunction, Request, Response } from "express";
import CustomError from "../lib/CustomError.js";
import { ControllerType } from "../types/types.js";

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

export const TryCatch =
  (handler: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
