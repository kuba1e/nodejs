import { NextFunction, Request, Response } from "express";
import { HttpCode } from "../types/http";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(HttpCode.INTERNAL_SERVER_ERROR);
  res.render("error", { error: err });
}

export default errorHandler;
