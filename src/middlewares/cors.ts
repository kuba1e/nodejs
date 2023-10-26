import { NextFunction, Request, Response } from "express";
import { headers } from "../config/headers";

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set(headers);
  next();
};
