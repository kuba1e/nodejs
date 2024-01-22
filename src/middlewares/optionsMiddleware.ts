import { NextFunction, Request, Response } from "express";
import { HttpCode } from "../types/http";

export const optionsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, GET, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.sendStatus(HttpCode.NO_CONTENT);
  } else {
    next();
  }
};
