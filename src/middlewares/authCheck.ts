import { NextFunction, Request, Response } from "express";
import { validateAccessToken } from "../controllers/token/validateAccessToken";
import logger from "../utils/logger";
import { User } from "../entity";

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.unauthorized("User is unauthorized");
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.unauthorized("User is unauthorized");
    }

    const userData = await validateAccessToken<Partial<User>>(accessToken);

    if (!userData) {
      return res.unauthorized("User is unauthorized");
    }

    req.userData = userData;
    await next();
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
