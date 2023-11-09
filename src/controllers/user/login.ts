import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import { User } from "../../entity";
import { TypedRequest } from "../../types/request";
import { UserRepository } from "../../models/user";
import logger from "../../utils/logger";
import { generate } from "../token/generate";
import { save } from "../token/save";
import { UserResponseDTO } from "../../dto/UserResponseDTO";

export const login = async (
  req: TypedRequest<Pick<User, "password" | "email">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password: providedPassword } = req.body;

    const user = await UserRepository.findOne({
      where: {
        email,
      },
      relations: {
        settings: true,
      },
    });

    const passwordMatched = await bcrypt.compare(
      providedPassword,
      user.password
    );
    if (passwordMatched) {
      const tokens = generate({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      await save(user.id, tokens.refreshToken);

      const transformedUser = plainToClass(UserResponseDTO, user);

      res.successWithToken({
        refreshToken: tokens.refreshToken,
        data: transformedUser,
      });
      logger.info(`Successfully found user: ${user.email}`);
    } else {
      res.unauthorized("Email or password is wrong!");
      logger.info(
        `User ${user.email} provided wrong password: ${providedPassword}`
      );
    }
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
