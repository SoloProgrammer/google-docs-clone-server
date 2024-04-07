import { NextFunction, Request, Response } from "express";
import { IncomingMessage, Server, ServerResponse } from "http";

export type ServerType = Server<typeof IncomingMessage, typeof ServerResponse>;

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
