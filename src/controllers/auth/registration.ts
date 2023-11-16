import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../entity";
import { TypedRequest } from "../../types/request";
import { DEFAULT_CHAT_SETTINGS } from "../../config/chat";
import { SettingsRepository } from "../../models/settings";
import { validate } from "class-validator";
import { UserRepository } from "../../models/user";
import logger from "../../utils/logger";

const saltRounds = Number(process.env.SALT_ROUNDS);

export const registration = async (
  req: TypedRequest<Partial<User>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      nickname,
      password,
      firstName,
      lastName,
      phoneNumber,
      avatar,
    } = req.body;

    const settings = await SettingsRepository.save({
      chatSetting: DEFAULT_CHAT_SETTINGS,
    });

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = {
      email,
      firstName,
      lastName,
      nickname,
      phoneNumber,
      avatar,
      settings,
      password: passwordHash,
    };

    const errors = await validate(newUser);

    if (errors.length > 0) {
      throw new Error(`Validation failed! Errors: ${errors.join(" ")}`);
    }

    await UserRepository.save(newUser);

    const user = await UserRepository.getUserByEmail(email);

    res.success({ data: user });
    logger.info(`Successfully created user with id: ${user.id}`);
  } catch (error) {
    const message = `Internal Server Error: ${error.message}`;
    logger.error(message);
    res.serverError(message);
  }
};
