import { Request, Response, NextFunction } from "express";
import { HttpCode } from "../types/http";

function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = (data = {}) => {
    res.status(HttpCode.OK).json(data);
  };

  res.badRequest = (message) => {
    res.status(HttpCode.BAD_REQUEST).json({ message });
  };

  res.unauthorized = (message) => {
    res.status(HttpCode.UNAUTHORIZED).json({ message });
  };

  res.notFound = (message) => {
    res.status(HttpCode.NOT_FOUND).json({ message });
  };

  res.serverError = (message) => {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message });
  };

  next();
}

export default responseMiddleware;