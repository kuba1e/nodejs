import { NextFunction, Request, Response } from "express";
import { HttpCode } from "../types/http";

export const optionsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, GET, PATCH, DELETE"
  );
  res.sendStatus(HttpCode.NO_CONTENT);
};
