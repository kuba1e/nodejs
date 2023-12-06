import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../entity";
import { TypedRequest } from "../../types/request";
import { UserRepository } from "../../models/user";
import { TokenRepository } from "../../models/token";
import logger from "../../utils/logger";
import { generate } from "../../utils/token/generate";

export const getByEmail = async (
  req: TypedRequest<Pick<User, "password" | "email">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.auth.email;

    const user = await UserRepository.getUserByEmail(email);

    res.success({
      data: user,
    });

    logger.info(`Successfully found user: ${user.email}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
