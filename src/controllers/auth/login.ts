import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../entity";
import { TypedRequest } from "../../types/request";
import { UserRepository } from "../../models/user";
import { TokenRepository } from "../../models/token";
import logger from "../../utils/logger";
import { generate } from "../../utils/token/generate";

export const login = async (
  req: TypedRequest<Pick<User, "password" | "email">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password: providedPassword } = req.body;

    const user = await UserRepository.getExtendedUserByEmail(email);

    const passwordMatched = await bcrypt.compare(
      providedPassword,
      user.password
    );

    if (!passwordMatched) {
      res.unauthorized("Email or password is wrong!");
      logger.info(
        `User ${user.email} provided wrong password: ${providedPassword}`
      );
      return;
    }

    const tokens = generate({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    await TokenRepository.upsert(
      {
        refreshToken: tokens.refreshToken,
        accessToken: tokens.accessToken,
        userId: user.id,
      },
      ["userId"]
    );

    const userResponse = await UserRepository.getUserByEmail(email);

    res.successWithToken({
      accessToken: tokens.accessToken,
      data: userResponse,
    });

    logger.info(`Successfully found user: ${user.email}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
