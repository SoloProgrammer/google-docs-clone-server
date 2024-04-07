import { NextFunction, Request, Response } from "express";
import CustomError from "../lib/CustomError.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["connect.sid"];

  if (!token) return next(new CustomError("Unauthenticated", 401));

  if (token && !req.user) {
    res.clearCookie("connect.sid");
    return next(new CustomError("Unauthenticated", 401));
  }

  next();
};
