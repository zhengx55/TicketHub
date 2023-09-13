import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthroize-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }
  next();
};
